import { SupportedCoins } from "constants/Coins";
import { getCoinGeckoPrice } from "core/rest/coingecko";
import { CoingeckoPrice } from "core/types/rest/coingecko";
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
	prices = {
		bitsong: 1,
	}
	enabledCoins: SupportedCoins[] = []
	pushNotificationToken = ''

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
		promises.push(requestToken())
		try
		{
			const responses = await Promise.all(promises)
			const enabledCoins = responses[0] as SupportedCoins[]
			const bitsongPrice = responses[1] as CoingeckoPrice
			const pushNotificationToken = responses[2] as string

			runInAction(() =>
			{
				this.prices.bitsong = bitsongPrice.bitsong.usd ?? 1
				this.enabledCoins.splice(1, this.enabledCoins.length, ...enabledCoins)
				this.firstLoad = true
				this.loading = false
				this.pushNotificationToken = pushNotificationToken
			})
		}
		catch(e: any)
		{
			console.log(e)
		}
	}
}
  