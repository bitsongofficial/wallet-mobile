import { SupportedCoins } from "constants/Coins";
import { getCoinGeckoPrice } from "core/rest/coingecko";
import { CoingeckoPrice } from "core/types/rest/coingecko";
import { autorun, makeAutoObservable, runInAction, toJS } from "mobx";

export default class RemoteConfigsStore {
	firstLoad = false
	loading = true
	prices = {
		bitsong: 1,
	}
	enabledCoins: SupportedCoins[] = []
	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })

		setInterval(this.requestData, 1000 * 60 * 60)
		this.requestData()
	}

	async requestData()
	{
		runInAction(() => this.loading = true)
		const promises = []
		promises.push(new Promise((resolve, reject) =>
		{
			setTimeout(() => {resolve([SupportedCoins.BITSONG])}, 1000)
		}))
		promises.push(getCoinGeckoPrice(SupportedCoins.BITSONG))
		try
		{
			const responses = await Promise.all(promises)
			const enabledCoins = responses[0] as SupportedCoins[]
			const bitsongPrice = responses[1] as CoingeckoPrice
			runInAction(() =>
			{
				this.prices.bitsong = bitsongPrice.bitsong.usd ?? 1
				this.enabledCoins.splice(1, this.enabledCoins.length, ...enabledCoins)
				this.firstLoad = true
				this.loading = false
			})
		}
		catch(e: any)
		{
			console.log(e)
		}
	}
}
  