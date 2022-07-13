import AsyncStorageLib from "@react-native-async-storage/async-storage"
import { autorun, IReactionDisposer, reaction, runInAction, toJS } from "mobx"
import DappConnectionStore from "./DappConnectionStore"
import SettingsStore from "./SettingsStore"
import WalletStore, { Profile } from "./WalletStore"
import { IWalletConnectSession } from "@walletconnect/types"
import { PermissionsAndroid } from "react-native"
import RemoteConfigsStore from "./RemoteConfigsStore"
import { SupportedCoins } from "constants/Coins"
import { AskPinMnemonicStore } from "core/storing/MnemonicStore"
import { WalletTypes } from "core/types/storing/Generic"
import { argon2Encode, argon2Verify } from "utils/argon"
import { askPin } from "navigation/AskPin"

const pin_hash_path = "pin_hash"
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
		this.setUpStores()

		this.loadSettings()
		this.saveSettings()

		this.connectionsLoadHandler = autorun(() =>
		{
			if(this.wallet.activeWallet)
			{
				this.loadConnections()
				this.connectionsLoadHandler()
			}
		})
		this.saveConnections()

		this.walletsLoadHandler = autorun(() =>
		{
			if(this.remoteConfigs.firstLoad) {
				this.loadWallets()
				this.walletsLoadHandler()
			}
		})
		this.saveWallets()
	}

	saveSettings()
	{
		reaction(
		() => JSON.stringify({
			language: toJS(this.settings.language),
			currency: toJS(this.settings.currency),
			biometric_enable: this.settings.biometric_enable,
			checkMethod: this.settings.checkMethod,
			theme: this.settings.theme,
			notification_enable: this.settings.notifications.enable,
		}),
		(raw) =>
		{
			console.log(raw)
			AsyncStorageLib.setItem(settings_location, raw)
		})
	}

	async loadSettings()
	{
		const raw = await AsyncStorageLib.getItem(settings_location)
		if(raw)
		{
			const settings = JSON.parse(raw)
			this.settings.setBiometricInternal(settings.biometric_enable)
			this.settings.setCheckMethod(settings.checkMethod)
			this.settings.setCurrency(settings.currency)
			this.settings.setTheme(settings.theme)
			this.settings.setLanguage(settings.language)
			this.settings.setNotifications({
				enable: settings.notification_enable,
				history: 10,
			})
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

	setUpStores()
	{
		runInAction(() =>
		{
			this.settings.localStorageManager = this
			this.dappConnection.localStorageManager = this
			this.wallet.localStorageManager = this
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
				console.log(json)
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

	async updatePinData(pin: string, newPin: string)
	{
		const mnemonics: {
			mnemonic: string,
			path: string,
		}[] = []
		try
		{
			await Promise.all(this.wallet.wallets.map(async (w) =>
				{
					let path
					switch(w.profile.type)
					{
						case WalletTypes.COSMOS:
							path = w.profile.data.mnemonicPath
					}
					const oldStore = new AskPinMnemonicStore(path, async () => {})
					oldStore.Unlock(pin)
					const mnemonic = await oldStore.Get()
					mnemonics.push({path, mnemonic})
				}))
		}
		catch
		{
			return false
		}
		try
		{
			await Promise.all(mnemonics.map(async m =>
				{
					const newStore = new AskPinMnemonicStore(m.path, async () => {})
					newStore.Unlock(newPin)
					newStore.Set(m.mnemonic)
				}))
			return true
		}
		catch
		{
			await Promise.all(mnemonics.map(async m =>
				{
					const newStore = new AskPinMnemonicStore(m.path, async () => {})
					newStore.Unlock(pin)
					newStore.Set(m.mnemonic)
				}))
			this.wallet.setSetUpsPin(pin)
			return false
		}
		return false
	}

	async setPin(pin: string): Promise<void>
	{
	  const granted = await PermissionsAndroid.request(
		PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
	  )
	  if (granted === PermissionsAndroid.RESULTS.GRANTED)
	  {
		const encodedHash = await argon2Encode(pin)
		await AsyncStorageLib.setItem(pin_hash_path, encodedHash)
	  }
	}
  
	async changePin(newPin?: string, pin?: string)
	{
		const actualPin = pin ?? await askPin()
		const actualNewPin = newPin ?? await askPin({disableVerification: true})
		if(this.verifyPin(actualPin))
		{
			const result = await this.updatePinData(actualPin, actualNewPin)
			try
			{
				if(result)
				{
					this.setPin(actualNewPin)
					this.wallet.setSetUpsPin(actualNewPin)
				}
			}
			catch
			{
				return false
			}
			return result
		}
	  	return false
	}
  
	async verifyPin(pin: string): Promise<boolean>
	{
		if(pin == "") return false
		try
		{
			const storedHash = await AsyncStorageLib.getItem(pin_hash_path)
			if(storedHash)
			{
				return await argon2Verify(pin, storedHash)
			}
			else
			{
				this.setPin(pin)
				return true
			}
		}
		catch(e)
		{
		}
		return false
	}
}