import { User } from "classes"
import { makeAutoObservable } from "mobx"
import SettingsStore from "./SettingsStore"
import WalletStore from "./WalletStore"
import CoinStore from "./CoinStore_2"
import RemoteConfigsStore from "./RemoteConfigsStore"
import DappConnectionStore from "./DappConnectionStore"
import LocalStorageManager from "./LocalStorageManager"
import ContactsStore from "./ContactsStore"
import ValidatorStore from "./ValidatorStore"
import ProposalsStore from "./ProposalsStore"
import BackgroundTimer from "react-native-background-timer"

export default class MainStore {
	auth = null
	configs = {
		remote: new RemoteConfigsStore(),
	}
	settings = new SettingsStore()
	wallet = new WalletStore(this.settings, this.configs.remote)
	coin = new CoinStore(this.wallet, this.configs.remote, this.settings)
	validators = new ValidatorStore(this.coin, this.wallet)
	proposals = new ProposalsStore(this.wallet, this.validators)
	dapp = new DappConnectionStore(
		this.wallet,
		this.coin,
		this.validators,
		this.configs.remote,
		this.settings,
	)
	contacts = new ContactsStore()
	localStorageManager = new LocalStorageManager(
		this.wallet,
		this.dapp,
		this.contacts,
		this.settings,
		this.configs.remote,
	)

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
		this.initApp()
	}

	initApp() {
		// config
		BackgroundTimer.runBackgroundTimer(this.configs.remote.requestData, 1000 * 60 * 60)
		this.configs.remote.requestData()
	}
}
