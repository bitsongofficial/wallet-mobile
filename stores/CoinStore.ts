import { SupportedCoins, SupportedCoinsMap } from "constants/Coins";
import { PublicWallet } from "core/storing/Generic";
import { CosmosWallet } from "core/storing/Wallet";
import { CoinClasses } from "core/types/coin/Dictionaries";
import { FromToAmount } from "core/types/coin/cosmos/FromToAmount";
import { Amount, Denom } from "core/types/coin/Generic";
import { CoinOperationEnum } from "core/types/coin/OperationTypes";
import { WalletTypes } from "core/types/storing/Generic";
import { autorun, makeAutoObservable, runInAction, toJS, values } from "mobx";
import { round } from "utils";
import WalletStore from "./WalletStore";
import { convertRateFromDenom, fromCoinToAmount, fromCoinToDefaultDenom, resolveAsset } from "core/utils/Coin";
import SettingsStore from "./SettingsStore";
import { isValidAddress } from "core/utils/Address";
import { getSendMessage } from "core/coin/cosmos/operations/Send";
import { globalLoading } from "modals";
import { FromToAmountIbc } from "core/types/coin/cosmos/FromToAmountIbc";
import ChainsStore from "./ChainsStore";
import { AssetBalance, ObservableAssetBalance } from "./models/AssetBalance";
import AssetsStore from "./AssetsStore";
import { Asset } from "./models/Asset";
import { AssetIndex } from "core/types/coin/Assets";
import { Chain, CosmosChain } from "./models/Chain";
import { ChainIndex } from "core/types/coin/Coin";

const maxRecentRecipients = 10

class LoadingState {
	balance: boolean = false
	send: boolean = false
	constructor()
	{
		makeAutoObservable(this)
	}
}

class ResultsState {
	balance: boolean | null = null
	send: boolean | null = null
	constructor()
	{
		makeAutoObservable(this)
	}
}

export default class CoinStore {
	balance: AssetBalance[] = []
	recentRecipients: {
		address: string,
		date: Date,
	}[] = []
	loading = new LoadingState()
	results = new ResultsState()
	constructor(private walletStore: WalletStore, private chainsStore: ChainsStore, private assetsStore: AssetsStore, private settingsStore: SettingsStore) {
		makeAutoObservable(this, {}, { autoBind: true });
		autorun(() => {this.updateBalances()})
	}

	async updateBalances()
	{
		runInAction(() =>
		{
			this.loading.balance = true
			this.results.balance = null
		})
		const userBalance: AssetBalance[] = []
		const balanceAwaits:Promise<Amount[]>[] = []
		const enabledChains =this.chainsStore.enabledCoins
		const activeProfile = this.walletStore.activeProfile
		const activeWallet = this.walletStore.activeWallet
		for(const chain of enabledChains)
		{
			const coin = CoinClasses[chain]
			try
			{
				if(activeProfile)
				{
					globalLoading.open()
					balanceAwaits.push((async () =>
					{
						if(activeWallet != null)
						{
							const chainWallet = activeWallet.wallets[chain]
							if(chainWallet)
							{
								return await coin.Do(CoinOperationEnum.Balance, {
									wallet: new PublicWallet(await chainWallet.Address())
								})
							}
						}
						throw "profile (" + activeWallet + ") or wallet of chain (" + chain + ") not found"
					})())
				}
			}
			catch(e) {
				console.error("Catched", e)
			}
		}
		let errors = false
		try
		{
			const balances = (await Promise.allSettled(balanceAwaits)).map(r =>
				{
					if(r.status == "fulfilled") return r.value
					return undefined
				})
			balances.forEach((chainBalances:Amount[] | undefined, i) =>
			{
				if(chainBalances)
				{
					if(chainBalances.length > 0) chainBalances.forEach(amount => {
						try
						{
							const balance = ObservableAssetBalance.fromChainAmount(enabledChains[i], amount)
							if(balance)	userBalance.push(balance)
						}
						catch(e){
							console.error("Catched", e)
						}
					})
				}
			})
			runInAction(() =>
			{
				this.balance.splice(0, this.balance.length, ...userBalance)
				this.loading.balance = false
				this.results.balance = errors
			})
		}
		catch(e)
		{
			console.error("Catched", e)
		}
		globalLoading.close()
	}

	get totalBalance()
	{
		return  this.balance.reduce(
			(total, balance) =>
			{
				if(balance.balance > 0)
				{
					const b = this.fiatAsExponent(this.fromAssetBalanceToFiat(balance) ?? 0, balance.denom)
					return (b ? b + total : total)
				}
				return total
			},
			0
		)
	}

	get availableCoins() {
		return this.balance.filter(b => b.balance > 0)
	}

	get hasCoins() {
		return this.availableCoins.length > 0
	}

	get CanSend()
	{
		return this.walletStore.activeProfile?.type != WalletTypes.WATCH
	}

	private sortByPrice(balance: AssetBalance[]) {
		const sortedBalance = [...balance]
		sortedBalance.sort(
			(c1, c2) =>
			{
				const c1Price = this.assetsStore.AssetPrice(c1.denom)
				const c2Price = this.assetsStore.AssetPrice(c2.denom)
				if(c1Price && c2Price) return c2Price * c2.balance - c1Price * c1.balance
				if(c1Price) return -1
				if(c2Price) return 1
				return c2.balance - c1.balance
			}
		)
		return sortedBalance
	}

	get orderedBalance() {
		return this.sortByPrice(this.balance)
	}

	get multiChainBalance() {
		const res = this.balance.reduce((prev: AssetBalance[], current: AssetBalance) =>
		{
			const sameCoin = prev.find(p => resolveAsset(p.denom) == resolveAsset(current.denom))
			if(typeof sameCoin !== undefined && sameCoin !== undefined)
			{
				sameCoin.balance += current.balance
			}
			else
			{
				const b = {chain: current.chain, denom: resolveAsset(current.denom), balance: current.balance}
				prev.push(b)
			}
			return prev
		}, [])
		return res
	}

	get multiChainOrderedBalance() {
		return this.sortByPrice(this.multiChainBalance)
	}

	private getWalletForChain(chain: ChainIndex | Chain)
	{
		const chainAsItem = chain as Chain
		const chainKey = this.chainsStore.ChainKey(chainAsItem.id ?? chain)
		if(!(chainKey && this.walletStore.activeWallet && this.walletStore.activeWallet.wallets[chainKey as SupportedCoins])) return undefined
		return this.walletStore.activeWallet.wallets[chainKey as SupportedCoins]
	}

	async sendAmount(chain: ChainIndex, address: string, amount: Amount, destinationChain?: ChainIndex)
	{
		const wallet = this.getWalletForChain(chain)
		const chainOperator = this.chainsStore.ChainOperator(chain)
		if(chainOperator === undefined) return
		if(!(wallet instanceof CosmosWallet) || !this.CanSend)
		{
			runInAction(() =>
			{
				this.loading.send = false
				this.results.send = false
			})
			throw {error: "operation not permitted"}
		}

		runInAction(() =>
		{
			this.results.send = null
			this.loading.send = true
		})
		try
		{
			let res: any
			if(destinationChain)
			{
				const chainAsCosmosChain = this.chainsStore.ResolveChain(chain) as CosmosChain
				if(chainAsCosmosChain === undefined) return
				const destinationChainId = this.chainsStore.ChainId(destinationChain)
				if(destinationChainId === undefined) return
				const destinationChainName = this.chainsStore.ChainName(destinationChain)
				if(destinationChainName === undefined) return
				const data: FromToAmountIbc = {
					from:  wallet as CosmosWallet,
					to: new PublicWallet(address),
					amount,
					destinationNetworkId: destinationChainId,
					ibcCoordinates: chainAsCosmosChain.ibcCoordinates(destinationChainName)
				}
				res = await chainOperator.Do(CoinOperationEnum.SendIbc, data)
			}
			else
			{
				const data: FromToAmount = {
					from:  wallet as CosmosWallet,
					to: new PublicWallet(address),
					amount,
				}
				res = await chainOperator.Do(CoinOperationEnum.Send, data)
			}
			this.addToRecent(address)
			runInAction(() =>
			{
				this.loading.send = false
				this.results.send = res
			})
			this.updateBalances()

			return res
		}
		catch(e)
		{
			console.error("Catched", e)
		}
	}

	async getSendMessage(chain: ChainIndex, address: string, amount: Amount)
	{
		const wallet = this.getWalletForChain(chain)
		try
		{
			const data: FromToAmount = {
				from:  wallet as CosmosWallet,
				to: new PublicWallet(address),
				amount,
			}
			return await getSendMessage(data)
		}
		catch(e)
		{
			console.error("Catched", e)
		}
	}

	findAssetWithCoin(coin: SupportedCoins)
	{
		return this.balance.find(b => b.denom == (CoinClasses[coin].denom()))
	}

	async sendAsset(chain: ChainIndex, address: string, balance: number, denom?: SupportedCoins | Denom | string)
	{
		const actualDenom = denom ?? this.chainsStore.ChainDefaultDenom(chain)
		if(actualDenom === undefined) return
		return await this.sendAmount(chain, address, fromCoinToAmount(balance, actualDenom))
	}

	async sendAssetIbc(coin: ChainIndex, destinationChain: ChainIndex, address: string, balance: number, denom?: SupportedCoins | Denom | string)
	{
		return await this.sendAmount(coin, address, fromCoinToAmount(balance, denom ?? coin), destinationChain)
	}

	fromFIATToBalance(fiat: number, asset: AssetIndex)
	{
		const assetPrice = this.assetsStore.AssetPrice(asset)
		if(assetPrice) return fiat / assetPrice
	}

	fromAmountToFIAT(amount: Amount)
	{
		const assetPrice = this.assetsStore.AssetPrice(amount.denom)
		const quantity = parseFloat(amount.amount)
		return (assetPrice !== undefined && !Number.isNaN(quantity)) ? assetPrice * quantity : undefined
	}

	fromCoinBalanceToFiat(balance: number, coin: SupportedCoins | string)
	{
		return this.fromAmountToFIAT(fromCoinToAmount(balance, coin))
	}

	fromAssetBalanceToFiat(balance: AssetBalance)
	{
		const assetPrice = this.assetsStore.AssetPrice(balance.denom)
		if(assetPrice) return balance.balance * assetPrice
		return undefined
	}

	balanceAsExponent(balance: AssetBalance, exponent=6)
	{
		const asset = this.assetsStore.ResolveAsset(balance.denom)
		return balance.balance * Math.pow(10, (asset?.exponent ?? exponent) - exponent)
	}

	fiatAsExponent(fiat: number, denom: string, exponent=6)
	{
		const asset = this.assetsStore.ResolveAsset(denom)
		return fiat * Math.pow(10, (asset?.exponent ?? exponent) - exponent)
	}

	balanceOf(asset: Asset, chain?: ChainIndex)
	{
		const chainKey = chain ? this.chainsStore.ChainKey(chain) : undefined
		return this.balance.find(ab => (resolveAsset(ab.denom) == resolveAsset(asset.denom) && (chainKey === undefined || ab.chain == chainKey)))
	}

	balanceOfAsExponent(asset: Asset, chain?: ChainIndex, exponent?: number)
	{
		const balance = this.balanceOf(asset, chain)
		if(balance === undefined) return undefined
		return this.balanceAsExponent(balance, exponent)
	}

	fiatValueOf(asset: Asset, chain?: ChainIndex)
	{
		const assetBalance = this.balanceOf(asset, chain)
		return assetBalance ? this.fromAssetBalanceToFiat(assetBalance) : undefined
	}

	fiatValueOfAsExponent(asset: Asset, chain?: ChainIndex, exponent?: number)
	{
		const fiat = this.fiatValueOf(asset, chain)
		if(fiat === undefined) return undefined
		return this.fiatAsExponent(fiat, asset.denom, exponent)
	}

	addToRecent(address : string, date?: Date)
	{
		if(isValidAddress(address))
		{
			runInAction(() =>
			{
				const i = this.recentRecipients.findIndex(e => e.address == address)
				if(i > -1)
				{
					this.recentRecipients.splice(i, 1)
				}
				this.recentRecipients.unshift(
					{
						address,
						date: date ?? new Date(),
					}
				)
				if(this.recentRecipients.length > maxRecentRecipients) this.recentRecipients.pop()
				if(date) this.recentRecipients.sort((r1, r2) => (r2.date.getTime() - r1.date.getTime()))
			})
		}
	}
}