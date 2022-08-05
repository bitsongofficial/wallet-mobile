import { makeAutoObservable, runInAction } from "mobx"
import { IChainCoinData, ICoin, IRemoteCoinData } from "classes/types"
import { CosmosCoin } from "core/coin/cosmos/CosmosCoin"
import { SupportedCoins } from "constants/Coins"
import { CoinClasses } from "core/types/coin/Dictionaries"
import { CoinOperationEnum } from "core/types/coin/OperationTypes"
import { PublicWallet } from "core/storing/Generic"
import { Amount } from "core/types/coin/Generic"
import { fromAmountToCoin, fromDenomToPrice } from "core/utils/Coin"

export default class CoinComplitedData {
	Coin: CosmosCoin
	address: string | null = null
	assets: Amount[] = []

	remoteData: Partial<IRemoteCoinData> | null = null
	chainData: Partial<IChainCoinData> | null = null

	constructor(public key: SupportedCoins) {
		this.Coin = CoinClasses[key]

		makeAutoObservable(this, {}, { autoBind: true })
	}

	setRemoteData(data: Partial<IRemoteCoinData> = {}) {
		console.log("setRemoteData", data)
		this.remoteData = data
	}

	setChainData(data: Partial<IChainCoinData> = {}) {
		this.chainData = data
	}

	setAddress(address: string) {
		this.address = address
	}

	async getAssets() {
		if (this.address) {
			const assets: Amount[] = await this.Coin.Do(CoinOperationEnum.Balance, {
				wallet: new PublicWallet(this.address),
			})
			console.log("assets", this.key, assets)
			runInAction(() => {
				this.assets = assets
			})
		}
	}

	// send(address: string, dollar: number) {}

	static createList() {
		return Object.values(SupportedCoins).map((id) => new CoinComplitedData(id))
	}

	// get balance() {
	//   return round(this.info.balance);
	// }

	// get balanceUSD() {
	//   const value = Coin.culcFiatBalance(this.info.balance, this.rate);

	//   return value ? round(value) : null;
	// }

	// increment() {
	//   this.info.balance = this.info.balance + 1;
	// }

	static culcFiatBalance(tokenBalance: number, rate?: number | null) {
		return rate ? rate * tokenBalance : null
	}

	static culcTokenBalance(fiatBalance: number, rate?: number) {
		return rate ? fiatBalance / rate : null
	}
}
