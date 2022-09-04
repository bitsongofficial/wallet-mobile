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
		this.proposals,
		this.settings,
		this.configs.remote,
	)
	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}

export type MockChain = {
	name: string
	tokenName: string
	logo: string
	id: string
}

const mockChain: MockChain[] = [
	{ id: "1", tokenName: "Adam Clay", name: "CLAY", logo: "" },
	{ id: "2", tokenName: "Fasano", name: "FASANO", logo: "" },
	{ id: "3", tokenName: "Vibranium", name: "VIBRA", logo: "" },
	{ id: "4", tokenName: "Rowanne", name: "RWNN", logo: "" },
	{ id: "5", tokenName: "N43 Records", name: "N43", logo: "" },
	{ id: "6", tokenName: "Purolobo", name: "LOBO", logo: "" },
]
