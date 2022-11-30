import { Coin } from "classes";
import mock from "classes/mock_new";
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
import RemoteConfigsStore from "./RemoteConfigsStore";
import WalletStore from "./WalletStore";
import { convertRateFromDenom, fromAmountToCoin, fromAmountToFIAT, fromCoinToAmount, fromCoinToDefaultDenom, fromDenomToPrice, fromFIATToAmount, resolveAsset, SupportedFiats } from "core/utils/Coin";
import SettingsStore from "./SettingsStore";
import { ICoin } from "classes/types";
import { isValidAddress } from "core/utils/Address";
import { getSendMessage } from "core/coin/cosmos/operations/Send";
import { globalLoading } from "modals";
import { FromToAmountIbc } from "core/types/coin/cosmos/FromToAmountIbc";
import ChainsStore from "./ChainsStore";

const maxRecentRecipients = 10

export default class CoinStore {
	coins: Coin[] = []
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
	constructor(private walletStore: WalletStore, private chains: ChainsStore, private remoteConfigs: RemoteConfigsStore, private settingsStore: SettingsStore) {
		makeAutoObservable(this, {}, { autoBind: true });
		autorun(() => {this.updateBalances()})
	}

	get Prices()
	{
		const prices: SupportedCoinsMap = {}
		for(const k of this.remoteConfigs.enabledCoins)
		{
			const realKey = k as SupportedCoins
			if(realKey)
			{
				const currency: SupportedFiats = this.settingsStore.currency ? this.settingsStore.currency : SupportedFiats.USD
				let price: number | undefined
				const currenciesPrices = this.remoteConfigs.prices[realKey]
				if(currenciesPrices) price = currenciesPrices[currency]
				prices[realKey] = price ?? 1
			}
		}
		return prices
	}

	async updateBalances()
	{
		runInAction(() =>
		{
			this.loading.balance = true
			this.results.balance = null
		})
		const coins:Coin[] = []
		const balanceAwaits:Promise<any>[] = [] 
		const infos:ICoin[] = [] 
		const waitings: Promise<boolean>[] = []
		const enabledChains =this.chains.enabledCoins
		for(const chain of enabledChains)
		{
			const coin = CoinClasses[chain]
			const info = Object.assign({}, mock[chain])
			try
			{
				if(this.walletStore.activeProfile)
				{
					globalLoading.open()
					waitings.push((async () =>
					{
						const profile = this.walletStore.activeWallet
						if(profile != null)
						{
							const chainWallet = profile.wallets[chain]
							if(chainWallet)
							{
								info.address = await chainWallet.Address()
								info._id = coin.denom()
								info.denom = coin.denom()
								balanceAwaits.push(coin.Do(CoinOperationEnum.Balance, {
									wallet: new PublicWallet(info.address)
								}))
								infos.push(info)
								return true
							}
						}
						return false
					})())
				}
			}
			catch(e) {
				console.error("Catched", e)
			}
		}
		let errors = false
		const a = await Promise.allSettled(waitings)
		try
		{
			const balances = (await Promise.allSettled(balanceAwaits)).map(r =>
				{
					if(r.status == "fulfilled") return r.value
					return 0
				})
			balances.forEach((balance:Amount[], i) =>
			{
				if(balance)
				{
					if(balance.length > 0) balance.forEach(asset => {
						try
						{
							const currentInfo = Object.assign({}, infos[i])
							currentInfo.denom = asset.denom
							currentInfo._id = asset.denom
							currentInfo.balance = fromAmountToCoin(asset)
							const coin = new Coin(currentInfo, fromDenomToPrice(asset.denom, this.Prices))
							coins.push(coin)
						}
						catch(e){
							console.error("Catched", e)
						}
					})
					else
					{
						const currentInfo = Object.assign({}, infos[i])
						currentInfo.balance = 0
						coins.push(new Coin(currentInfo, 1))
					}
				}
				else
				{
					infos[i].balance = 0
					coins.push(new Coin(infos[i], 1))					
					errors = true
				}
			})
			runInAction(() =>
			{
				this.coins.splice(0, this.coins.length, ...coins.sort((c1, c2) => (this.fromCoinToFiat(c2) ?? c2.info.balance) - (this.fromCoinToFiat(c1) ?? c1.info.balance)))
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
			this.coins.reduce(
				(total, coin) =>
				{
					if(coin.balance > 0)
					{
						const b = this.fromCoinToFiat(coin)
						return (b ? b + total : total)
					}
					return total
				},
				0
			)
		)
	}

	get availableCoins() {
		return this.coins.filter(c => c.balance > 0)
	}

	get hasCoins() {
		return this.availableCoins.length > 0
	}

	get CanSend()
	{
		return this.walletStore.activeProfile?.type != WalletTypes.WATCH
	}

	get multiChainCoins() {
		const res = this.coins.reduce((prev: Coin[], current: Coin) =>
		{
			const sameCoin = prev.find(p => resolveAsset(p.info.denom) == resolveAsset(current.info.denom))
			if(typeof sameCoin !== undefined && sameCoin !== undefined)
			{
				sameCoin.info.balance += current.info.balance
			}
			else
			{
				const c = new Coin(Object.assign(toJS(current.info), {denom: resolveAsset(current.info.denom)}), current.rate)
				prev.push(c)
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

	findAssetWithDenom(denom: Denom)
	{
		return this.coins.find(c => c.info.denom == denom)
	}

	findAssetWithCoin(coin: SupportedCoins)
	{
		return this.findAssetWithDenom(CoinClasses[coin].denom())
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
		return await this.sendAmount(coin, address, fromFIATToAmount(fiat, fromCoinToDefaultDenom(coin), this.Prices))
	}

	fromFIATToAssetAmount(fiat: number, asset: SupportedCoins)
	{
		const assetAmount = fromFIATToAmount(fiat, fromCoinToDefaultDenom(asset), this.Prices)
		return parseFloat(assetAmount.amount) /* / convertRateFromDenom(assetAmount.denom) */
	}

	fromFIATToCoin(fiat: number, asset: SupportedCoins)
	{
		const assetAmount = fromFIATToAmount(fiat, fromCoinToDefaultDenom(asset), this.Prices)
		return parseFloat(assetAmount.amount) / (convertRateFromDenom(assetAmount.denom) ?? 1)
	}

	fromAmountToFIAT(amount: Amount)
	{
		return fromAmountToFIAT(amount, this.Prices)
	}

	fromCoinBalanceToFiat(balance: number, coin: SupportedCoins | string)
	{
		return this.fromAmountToFIAT(fromCoinToAmount(balance, coin))
	}

	fromCoinToFiat(coin: Coin)
	{
		return this.fromCoinBalanceToFiat(coin.balance, coin.info.denom)
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