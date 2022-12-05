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

const maxRecentRecipients = 10

export default class CoinStore {
	balance: AssetBalance[] = []
	recentRecipients: {
		address: string,
		date: Date,
	}[] = []
	loading = {
		balance: false,
		send: false,
	}
	results: {
		balance: boolean | null,
		send: boolean | null,
	} = {
		balance: null,
		send: null,
	}
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
		const waitings: Promise<boolean>[] = []
		const enabledChains =this.chainsStore.enabledCoins
		for(const chain of enabledChains)
		{
			const coin = CoinClasses[chain]
			try
			{
				if(this.walletStore.activeProfile)
				{
					globalLoading.open()
					balanceAwaits.push((async () =>
					{
						const profile = this.walletStore.activeWallet
						if(profile != null)
						{
							const chainWallet = profile.wallets[chain]
							if(chainWallet)
							{
								return await coin.Do(CoinOperationEnum.Balance, {
									wallet: new PublicWallet(await chainWallet.Address())
								})
							}
						}
						throw "profile (" + profile + ") or wallet of chain (" + chain + ") not found"
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
							const balance = ObservableAssetBalance.fromAmount(amount)
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
				this.balance.splice(0, this.balance.length, ...userBalance.sort(
					(c1, c2) =>
					{
						const c1Price = this.assetsStore.AssetPrice(c1.denom)
						const c2Price = this.assetsStore.AssetPrice(c2.denom)
						if(c1Price && c2Price) return c2Price - c1Price
						if(c1Price) return -1
						if(c2Price) return 1
						return c2.balance - c1.balance
					}
				))
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
		return round(
			this.balance.reduce(
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
				const b = {denom: resolveAsset(current.denom), balance: current.balance}
				prev.push(b)
			}
			return prev
		}, [])
		return res
	}

	async sendAmount(coin: SupportedCoins, address: string, amount: Amount, destinationChain?: SupportedCoins)
	{
		runInAction(() =>
		{
			this.results.send = null
			this.loading.send = true
		})
		if(!(this.walletStore.activeWallet && this.walletStore.activeWallet.wallets[coin])) return
		const coinClass = CoinClasses[coin]
		const wallet = this.walletStore.activeWallet.wallets[coin]
		if(!(wallet instanceof CosmosWallet) || !this.CanSend)
		{
			runInAction(() =>
			{
				this.loading.send = false
				this.results.send = false
			})
			throw {error: "operation not permitted"}
		}
		try
		{
			let res: any
			if(destinationChain)
			{
				const data: FromToAmountIbc = {
					from:  wallet as CosmosWallet,
					to: new PublicWallet(address),
					amount,
					destinationNetwork: destinationChain,
				}
				res = await coinClass.Do(CoinOperationEnum.SendIbc, data)
			}
			else
			{
				const data: FromToAmount = {
					from:  wallet as CosmosWallet,
					to: new PublicWallet(address),
					amount,
				}
				res = await coinClass.Do(CoinOperationEnum.Send, data)
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

	async sendMessage(coin: SupportedCoins, address: string, amount: Amount)
	{
		if(!(this.walletStore.activeWallet && this.walletStore.activeWallet.wallets[coin])) return
		const wallet = this.walletStore.activeWallet.wallets[coin]
		if(!(wallet instanceof CosmosWallet) || !this.CanSend)
		{
			runInAction(() =>
			{
				this.loading.send = false
				this.results.send = false
			})
			throw {error: "operation not permitted"}
		}
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

	async sendCoin(coin: SupportedCoins, address: string, balance: number, denom?: SupportedCoins | Denom | string)
	{
		return await this.sendAmount(coin, address, fromCoinToAmount(balance, denom ?? coin))
	}

	async sendCoinIbc(coin: SupportedCoins, destinationChain: SupportedCoins, address: string, balance: number, denom?: SupportedCoins | Denom | string)
	{
		return await this.sendAmount(coin, address, fromCoinToAmount(balance, denom ?? coin), destinationChain)
	}

	async sendFiat(coin: SupportedCoins, address: string, fiat: number)
	{
		return await this.sendAmount(coin, address, fromFIATToAmount(fiat, fromCoinToDefaultDenom(coin), this.assetsStore.Prices))
	}

	fromFIATToAssetAmount(fiat: number, asset: SupportedCoins)
	{
		const assetAmount = fromFIATToAmount(fiat, fromCoinToDefaultDenom(asset), this.assetsStore.Prices)
		return parseFloat(assetAmount.amount) /* / convertRateFromDenom(assetAmount.denom) */
	}

	fromFIATToCoin(fiat: number, asset: SupportedCoins)
	{
		const assetAmount = fromFIATToAmount(fiat, fromCoinToDefaultDenom(asset), this.assetsStore.Prices)
		return parseFloat(assetAmount.amount) / (convertRateFromDenom(assetAmount.denom) ?? 1)
	}

	fromAmountToFIAT(amount: Amount)
	{
		const assetPrice = this.assetsStore.AssetPrice(amount.denom)
		const quantity = parseFloat(amount.amount)
		return (assetPrice !== undefined && quantity !== NaN) ? assetPrice * quantity : undefined
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