import { makeAutoObservable } from "mobx"
import SettingsStore from "./SettingsStore"
import WalletStore from "./WalletStore"
import CoinStore from "./CoinStore"
import RemoteConfigsStore from "./RemoteConfigsStore"
import DappConnectionStore from "./DappConnectionStore"
import LocalStorageManager from "./LocalStorageManager"
import ContactsStore from "./ContactsStore"
import ValidatorStore from "./ValidatorStore"
import ProposalsStore from "./ProposalsStore"
import BackgroundTimer from "react-native-background-timer"
import NotificationsStore from "./NotificationsStore"
import ChainsStore from "./ChainsStore"
import AssetsStore from "./AssetsStore"

export default class MainStore {
	auth = null
	configs = {
		remote: new RemoteConfigsStore(),
	}
	settings = new SettingsStore()
	chains = new ChainsStore(this.settings, this.configs.remote)
	assets = new AssetsStore(this.chains, this.settings)
	wallet = new WalletStore(this.chains, this.settings, this.configs.remote)
	coin = new CoinStore(this.wallet, this.chains, this.assets, this.settings)
	dapp = new DappConnectionStore(
		this.wallet,
		this.chains,
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
	notifications = new NotificationsStore()

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
