import { SupportedCoins } from "constants/Coins";
import { getCoinGeckoPrices } from "core/rest/coingecko";
import { CoingeckoPrice, CoingeckoPrices } from "core/types/rest/coingecko";
import { autorun, makeAutoObservable, runInAction, toJS } from "mobx";

import firebase from '@react-native-firebase/app'
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'

const requestUserPermission = async () => {
	const authorizationStatus = await messaging().requestPermission();

	if (authorizationStatus) {
		console.log('Permission status:', authorizationStatus);
	}

	return authorizationStatus
}

const requestToken = async () => {
	try {
		const authorizationStatus = await requestUserPermission()

		if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
			const token = await messaging().getToken({
				senderId: firebase.app().options.messagingSenderId
			})

			return token
			//Alert.alert('A new FCM message arrived!', JSON.stringify(token));
		} else {
			console.error('Push notification, authorization denied')
		}
	} catch (error) {
		console.error(error)
	}
}

export default class RemoteConfigsStore {
	firstLoad = false
	loading = true
	prices: {
		[key in SupportedCoins]?: number
	} = {}
	enabledCoins: SupportedCoins[] = []
	pushNotificationToken = ''

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })

		for(const sc of Object.values(SupportedCoins))
		{
			this.prices[sc] = 1
		}
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
		promises.push(getCoinGeckoPrices([SupportedCoins.BITSONG]))
		promises.push(requestToken())
		try
		{
			const results = (await Promise.allSettled(promises)).map(e =>
				{
					if(e.status == "fulfilled") return e.value
					return null
				})
			const [enabledCoins, coingeckoPrices, pushNotificationToken] = results as [SupportedCoins[], CoingeckoPrices, string]
			runInAction(() =>
			{
				for(const sc of Object.values(SupportedCoins))
				{
					this.prices[sc] = coingeckoPrices[sc].usd ?? 1
				}
				// this.prices.bitsong = bitsongPrice
				this.enabledCoins.splice(1, this.enabledCoins.length, ...(enabledCoins ?? []))
				this.pushNotificationToken = pushNotificationToken ?? ""
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
  