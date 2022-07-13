import { Coin } from "classes";
import mock from "classes/mock";
import { ICoin } from "classes/types";
import { SupportedCoins, SupportedCoinsMap } from "constants/Coins";
import { PublicWallet } from "core/storing/Generic";
import { CosmosWallet } from "core/storing/Wallet";
import { CoinClasses } from "core/types/coin/Dictionaries";
import { FromToAmount } from "core/types/coin/cosmos/FromToAmount";
import { Amount } from "core/types/coin/Generic";
import { CoinOperationEnum } from "core/types/coin/OperationTypes";
import { WalletData, WalletTypes } from "core/types/storing/Generic";
import { autorun, keys, makeAutoObservable, runInAction, toJS, values } from "mobx";
import { round } from "utils";
import RemoteConfigsStore from "./RemoteConfigsStore";
import WalletStore, { ProfileWallets } from "./WalletStore";
import { convertRateFromDenom, fromAmountToCoin, fromAmountToFIAT, fromCoinToDefaultDenom, fromDenomToPrice, fromFIATToAmount, SupportedFiats } from "core/utils/Coin";
import SettingsStore from "./SettingsStore";

export default class CoinStore {
	coins: Coin[] = []
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
	constructor(private walletStore: WalletStore, private remoteConfigs: RemoteConfigsStore, private settingsStore: SettingsStore) {
		makeAutoObservable(this, {}, { autoBind: true });
		autorun(() => {this.updateBalances()})
	}

	get Prices()
	{
		const prices: SupportedCoinsMap = {}
		console.log(toJS(this.remoteConfigs.prices))
		for(const k of keys(this.remoteConfigs.prices))
		{
			const realKey = k as SupportedCoins
			if(realKey)
			{
				const currency: SupportedFiats = this.settingsStore.currency ? this.settingsStore.currency.name : SupportedFiats.USD
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
		console.log(toJS(this.Prices))
		runInAction(() =>
		{
			this.loading.balance = true
			this.results.balance = null
		})
		const coins:Coin[] = []
		const balanceAwaits:Promise<any>[] = [] 
		const infos:ICoin[] = [] 
		const waitings: Promise<boolean>[] = []
		for(const chain of this.remoteConfigs.enabledCoins)
		{
			const coin = CoinClasses[chain]
			const info = Object.assign({}, mock[chain])
			try
			{
				if(this.walletStore.activeProfile)
				{
					waitings.push((async () =>
					{
						const profile = this.walletStore.activeWallet
						info.address = await profile?.wallets[chain].Address()
						balanceAwaits.push(coin.Do(CoinOperationEnum.Balance, {
							wallet: new PublicWallet(info.address)
						}))
						infos.push(info)
						return true
					})())
				}
			}
			catch(e) {
				console.log(e)
			}
		}
		let errors = false
		await Promise.allSettled(waitings)
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
						const currentInfo = Object.assign({}, infos[i])
						currentInfo.balance = fromAmountToCoin(asset)
						coins.push(new Coin(currentInfo, fromDenomToPrice(asset.denom, this.Prices)))
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
				this.coins.splice(0, this.coins.length, ...coins)
				this.loading.balance = false
				this.results.balance = errors
			})
		}
		catch(e)
		{
			console.log(e)
		}
	}

	get totalBalance()
	{
	  return round(
		this.coins.reduce(
		  (total, coin) => (coin.balanceUSD ? coin.balanceUSD + total : total),
		  0
		)
	  )
	}

	get CanSend()
	{
		return this.walletStore.activeProfile?.type != WalletTypes.WATCH
	}

	async send(coin: SupportedCoins, address: string, fiat:number)
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
			const data: FromToAmount = {
				from:  wallet as CosmosWallet,
				to: new PublicWallet(address),
				amount: fromFIATToAmount(fiat, coinClass.coin.denom(), this.Prices),
			}
			const res = await coinClass.Do(CoinOperationEnum.Send, data)
			runInAction(() =>
			{
				this.loading.send = false
				this.results.send = res
			})
			this.updateBalances()
		}
		catch(e)
		{
			console.log(e)
		}
	}

	fromFIATToAssetAmount(fiat: number, asset: SupportedCoins)
	{
		const assetAmount = fromFIATToAmount(fiat, fromCoinToDefaultDenom(asset), this.Prices)
		return parseFloat(assetAmount.amount) * convertRateFromDenom(assetAmount.denom)
	}

	fromAmountToFiat(amount: Amount)
	{
		return fromAmountToFIAT(amount, this.Prices)
	}
}