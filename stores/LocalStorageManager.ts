import AsyncStorageLib from "@react-native-async-storage/async-storage"
import { autorun, IReactionDisposer, reaction, runInAction, toJS } from "mobx"
import DappConnectionStore from "./DappConnectionStore"
import SettingsStore from "./SettingsStore"
import WalletStore, { Profile } from "./WalletStore"
import { IWalletConnectSession } from "@walletconnect/types"
import { PermissionsAndroid } from "react-native"
import RemoteConfigsStore from "./RemoteConfigsStore"

const settings_location = "settings"
const session_location = "wc_sessions"
const stored_wallets_path = "stored_wallets"

export default class LocalStorageManager
{
	private connectionsLoadHandler: IReactionDisposer
	private walletsLoadHandler: IReactionDisposer
	constructor(
		private wallet: WalletStore,
		private dappConnection: DappConnectionStore,
		private settings: SettingsStore,
		private remoteConfigs: RemoteConfigsStore,
	)
	{
		this.saveConnections()
		this.loadSettings()

		this.connectionsLoadHandler = autorun(() =>
		{
			if(this.wallet.activeWallet)
			{
				this.loadConnections()
				this.connectionsLoadHandler()
			}
		})
		this.setUpConnectionsStore()

		this.walletsLoadHandler = autorun(() =>
		{
			if(this.remoteConfigs.firstLoad) {
				this.loadWallets()
				this.walletsLoadHandler()
			}
		})
	}

	saveSettings()
	{
		reaction(
		() => JSON.stringify({
			language: this.settings.language,
			currency: this.settings.currency,
			biometric_enable: this.settings.biometric_enable,
			checkMethod: this.settings.checkMethod,
			theme: this.settings.theme,
		}),
		(raw) =>
		{
			AsyncStorageLib.setItem(settings_location, raw)
		})
	}

	async loadSettings()
	{
		const raw = await AsyncStorageLib.getItem(settings_location)
		if(raw)
		{
			const settings = JSON.parse(raw)
			this.settings.setBiometric(settings.biometric_enabled)
			this.settings.setCheckMethod(settings.checkMethod)
			this.settings.setCurrency(settings.currency)
			this.settings.setTheme(settings.theme)
			this.settings.setLanguage(settings.language)
		}
	}

	saveConnections()
	{
		const raw = JSON.stringify(this.dappConnection.connections.filter(c => c.connector != null).map(c => c.connector?.session))
		try {
			AsyncStorageLib.setItem(session_location, raw)
		}
		catch(e)
		{
			console.log("save to large", e)
		}
	}

	async loadConnections()
	{
		try
		{
			const storedSessions = await AsyncStorageLib.getItem(session_location)
			if(storedSessions)
			{
				const sessions = JSON.parse(storedSessions) as IWalletConnectSession[]
				sessions.forEach(session => {
					this.dappConnection.connect(undefined, session)
				})
			}
		}
		catch(e)
		{
			console.log("load to large", e)
		}
		reaction(
			() => JSON.stringify(this.dappConnection.connections.filter(c => c.connector != undefined).map(c => c.connector?.session)),
			(raw) =>
			{
				try {
					AsyncStorageLib.setItem(session_location, raw)
				}
				catch(e)
				{
					console.log("save to large", e)
				}
			}
		)
	}

	setUpConnectionsStore()
	{
		runInAction(() =>
		{
			this.dappConnection.localStorageManager = this
		})
	}

	async loadWallets()
	{
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
		)
		if(granted === PermissionsAndroid.RESULTS.GRANTED)
		{
			const serializedWalletsRaw = await AsyncStorageLib.getItem(stored_wallets_path)
			if(serializedWalletsRaw != null)
			{
				const serializedWallets = JSON.parse(serializedWalletsRaw) as Array<Profile>
				if(serializedWallets != null)
				{
				runInAction(() =>
				{
					this.wallet.profiles.splice(0, this.wallet.profiles.length, ...serializedWallets)
					if(this.wallet.profiles.length > 0) this.wallet.activeProfile = this.wallet.profiles[0]
				})
				}
			}
		}
		runInAction(() =>
		{
			this.wallet.loadedFromMemory = true
		})
	}

	async saveWallets()
	{
		reaction(
			() => JSON.stringify(toJS(this.wallet.profiles)),
			async (json) =>
			{
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
				)
				if (granted === PermissionsAndroid.RESULTS.GRANTED)
				{
					AsyncStorageLib.setItem(stored_wallets_path, json)
				}
			}
		)
	}
}