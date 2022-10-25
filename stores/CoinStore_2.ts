import { Coin, Coin_fixed } from "classes"
import { Coin as CoinClass } from "core/coin/Generic"
import mock from "classes/mock_new"
import { ICoin } from "classes/types_new"
import { SupportedCoins, SupportedCoinsMap } from "constants/Coins"
import { PublicWallet } from "core/storing/Generic"
import { CosmosWallet } from "core/storing/Wallet"
import { CoinClasses } from "core/types/coin/Dictionaries"
import { FromToAmount } from "core/types/coin/cosmos/FromToAmount"
import { Amount, Denom } from "core/types/coin/Generic"
import { CoinOperationEnum } from "core/types/coin/OperationTypes"
import { WalletData, WalletTypes } from "core/types/storing/Generic"
import { autorun, keys, makeAutoObservable, reaction, runInAction, set, toJS, values } from "mobx"
import { round } from "utils"
import RemoteConfigsStore from "./RemoteConfigsStore"
import WalletStore, { ProfileWallets } from "./WalletStore"
import {
	convertRateFromDenom,
	fromAmountToCoin,
	fromAmountToFIAT,
	fromCoinToAmount,
	fromCoinToDefaultDenom,
	fromDenomToPrice,
	fromFIATToAmount,
	SupportedFiats,
} from "core/utils/Coin"
import SettingsStore from "./SettingsStore"
import Config from "react-native-config"

export default class CoinStore {
	coins: Coin[] = []
	loading = {
		balance: false,
		send: false,
	}

	results: {
		balance: boolean | null
		send: boolean | null
	} = {
		balance: null,
		send: null,
	}

	constructor(
		private walletStore: WalletStore,
		private remoteConfigs: RemoteConfigsStore,
		private settingsStore: SettingsStore,
	) {
		makeAutoObservable(this, {}, { autoBind: true })
		console.log("Constructor coinStore")
		this.init()
		autorun(() => this.init())
		autorun(() => {
			this.updateBalances()
		})
	}

	get Prices() {
		console.log("get Prices()")
		// Цена подерживаемых монеток
		const prices: SupportedCoinsMap = {}
		for (const k of keys(this.remoteConfigs.prices)) {
			const realKey = k as SupportedCoins
			console.log(" --------realKey --------------", realKey)

			if (realKey) {
				const currency: SupportedFiats = this.settingsStore.currency
					? this.settingsStore.currency
					: SupportedFiats.USD

				let price: number | undefined
				const currenciesPrices = this.remoteConfigs.prices[realKey]

				if (currenciesPrices) price = currenciesPrices[currency]
				prices[realKey] = price ?? 1
			}
		}
		return prices
	}

	coins_2: {
		[k in SupportedCoins]?: Coin_fixed
	} = {}

	createCoins() {
		console.log("------ createCoins --------")
		const enabledCoins = this.remoteConfigs.enabledCoins

		enabledCoins.map((chain) => set(this.coins_2, chain, new Coin_fixed(chain)))
	}

	get coinsList() {
		return values(this.coins_2)
	}

	async updInfo() {
		const activeWallet = this.walletStore.activeWallet
		console.log("activeWallet", toJS(activeWallet))
		if (activeWallet) {
			await Promise.all(
				this.coinsList.map(async (coin) => {
					coin?.setAddress(await activeWallet?.wallets[coin.key].Address())
					// coin?.setRemoteData()
					// coin?.key
				}),
			)
		}
	}

	async updBalances() {
		return Promise.all(this.coinsList.map((coin) => coin?.getAssets()))
	}

	async init() {
		console.log("----------- init COIN STORE 2 --------------")

		try {
			const activeProfile = this.walletStore.activeProfile

			console.log("activeProfile", toJS(activeProfile))

			if (activeProfile) {
				console.log("URRA!!!!!")
				this.createCoins()
				// //
				await this.updInfo().catch((error) => console.log("error updINfo", error))
				await this.updBalances().catch((error) => console.log("error updBalances", error))
			}
		} catch (error) {
			console.log("error init ----->", error)
		}
	}

	async updateBalances() {
		// console.log("async updateBalances()")
		// console.log(toJS(this.settingsStore.currency))
		runInAction(() => {
			this.loading.balance = true
			this.results.balance = null
		})
		const coins: Coin[] = []
		const balanceAwaits: Promise<any>[] = []
		const infos: ICoin[] = []
		const waitings: Promise<boolean>[] = []

		for (const chain of this.remoteConfigs.enabledCoins) {
			const coin = CoinClasses[chain]
			const info = Object.assign({}, mock[chain])
			try {
				if (this.walletStore.activeProfile) {
					waitings.push(
						(async () => {
							const profile = this.walletStore.activeWallet
							info.address = await profile?.wallets[chain].Address()
							info._id = coin.denom()
							info.denom = coin.denom()
							console.log("info.address", info.address)
							balanceAwaits.push(
								coin.Do(CoinOperationEnum.Balance, {
									wallet: new PublicWallet(info.address),
								}),
							)
							infos.push(info)
							return true
						})(),
					)
				}
			} catch (e) {
				console.log("test test test", e)
				console.error("Catched", e)
			}
		}

		let errors = false
		await Promise.allSettled(waitings)

		try {
			const balances = (await Promise.allSettled(balanceAwaits)).map((r) => {
				if (r.status == "fulfilled") return r.value
				return 0
			})
			balances.forEach((balance: Amount[], i) => {
				if (balance) {
					if (balance.length > 0)
						balance.forEach((asset) => {
							try {
								const currentInfo = Object.assign({}, infos[i])
								currentInfo.denom = asset.denom
								currentInfo._id = asset.denom
								currentInfo.balance = fromAmountToCoin(asset)
								coins.push(new Coin(currentInfo, fromDenomToPrice(asset.denom, this.Prices)))
							} catch (e) {
								console.error("Catched", e)
							}
						})
					else {
						const currentInfo = Object.assign({}, infos[i])
						currentInfo.balance = 0
						coins.push(new Coin(currentInfo, 1))
					}
				} else {
					infos[i].balance = 0
					coins.push(new Coin(infos[i], 1))
					errors = true
				}
			})
			runInAction(() => {
				this.coins.splice(0, this.coins.length, ...coins)
				this.loading.balance = false
				this.results.balance = errors
			})
		} catch (e) {
			console.error("Catched", e)
		}
	}

	get totalBalance() {
		console.log("get totalBalance()")
		return round(
			this.coins.reduce((total, coin) => (coin.balanceUSD ? coin.balanceUSD + total : total), 0),
		)
	}

	get CanSend() {
		console.log("get CanSend()")
		return this.walletStore.activeProfile?.type != WalletTypes.WATCH
	}

	async sendAmount(coin: SupportedCoins, address: string, amount: Amount) {
		console.log("async sendAmount(coin: SupportedCoins, address: string, amount: Amount)")
		runInAction(() => {
			this.results.send = null
			this.loading.send = true
		})
		if (!(this.walletStore.activeWallet && this.walletStore.activeWallet.wallets[coin])) return
		const coinClass = CoinClasses[coin]
		const wallet = this.walletStore.activeWallet.wallets[coin]
		if (!(wallet instanceof CosmosWallet) || !this.CanSend) {
			runInAction(() => {
				this.loading.send = false
				this.results.send = false
			})
			throw { error: "operation not permitted" }
		}
		try {
			const data: FromToAmount = {
				from: wallet as CosmosWallet,
				to: new PublicWallet(address),
				amount,
			}
			const res = await coinClass.Do(CoinOperationEnum.Send, data)
			runInAction(() => {
				this.loading.send = false
				this.results.send = res
			})
			this.updateBalances()

			return res
		} catch (e) {
			console.error("Catched", e)
		}
	}

	findAssetWithDenom(denom: Denom) {
		console.log("findAssetWithDenom(denom: Denom)")
		return this.coins.find((c) => c.info.denom == denom)
	}

	findAssetWithCoin(coin: SupportedCoins) {
		console.log("findAssetWithCoin(coin: SupportedCoins)")
		return this.findAssetWithDenom(CoinClasses[coin].denom())
	}

	async sendCoin(coin: SupportedCoins, address: string, balance: number) {
		console.log("async sendCoin(coin: SupportedCoins, address: string, balance: number)")
		const denom = fromCoinToDefaultDenom(coin)
		return await this.sendAmount(coin, address, {
			amount: (balance * convertRateFromDenom(denom)).toString(),
			denom: denom,
		})
	}

	async sendFiat(coin: SupportedCoins, address: string, fiat: number) {
		console.log("async sendFiat(coin: SupportedCoins, address: string, fiat: number)")
		return await this.sendAmount(
			coin,
			address,
			fromFIATToAmount(fiat, fromCoinToDefaultDenom(coin), this.Prices),
		)
	}

	fromFIATToAssetAmount(fiat: number, asset: SupportedCoins) {
		console.log("fromFIATToAssetAmount(fiat: number, asset: SupportedCoins)")
		const assetAmount = fromFIATToAmount(fiat, fromCoinToDefaultDenom(asset), this.Prices)
		return parseFloat(assetAmount.amount) /* / convertRateFromDenom(assetAmount.denom) */
	}

	fromFIATToCoin(fiat: number, asset: SupportedCoins) {
		console.log("fromFIATToCoin(fiat: number, asset: SupportedCoins)")
		const assetAmount = fromFIATToAmount(fiat, fromCoinToDefaultDenom(asset), this.Prices)
		return parseFloat(assetAmount.amount) / (convertRateFromDenom(assetAmount.denom) ?? 1)
	}

	fromAmountToFIAT(amount: Amount) {
		console.log("fromAmountToFIAT(amount: Amount)")
		return fromAmountToFIAT(amount, this.Prices)
	}

	fromCoinToFiat(balance: number, coin: SupportedCoins) {
		console.log("fromCoinToFiat(balance: number, coin: SupportedCoins)")
		return this.fromAmountToFIAT(fromCoinToAmount(balance, coin))
	}

	fromCoinBalanceToFiat(balance: number, coin: SupportedCoins) {
		console.log("fromCoinBalanceToFiat(balance: number, coin: SupportedCoins)")
		const a = CoinClasses[coin]
		if (a) {
			return this.fromCoinToFiat(balance, coin)
		}

		return 0
	}
}
