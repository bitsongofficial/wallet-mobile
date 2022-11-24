import { action, autorun, makeAutoObservable, makeObservable, observable, runInAction, toJS } from "mobx";
import RemoteConfigsStore from "./RemoteConfigsStore";
import WalletStore from "./WalletStore";
import { IWalletConnectSession } from "@walletconnect/types"
import LocalStorageManager from "./LocalStorageManager";
import SettingsStore from "./SettingsStore";
import { SupportedCoins } from "constants/Coins";
import { WalletConnectBaseEvents, WalletConnectConnectorV1, WalletInterface } from "core/connection/WalletConnect/ConnectorV1";
import { Wallet } from "core/types/storing/Generic";
import { CosmosWallet } from "core/storing/Wallet";
import { KeplrConnector } from "core/connection/WalletConnect/KeplrConnector";
import { StdSignDoc } from "@cosmjs-rn/amino";
import ChainsStore from "./ChainsStore";

class StoreDrivenWalletInterface implements WalletInterface {
	constructor(private walletStore: WalletStore, private profileId: string) {}
	async Address(chain: SupportedCoins) {
		return await this.walletStore.address(this.profileId, chain) ?? ""
	}
	Wallet(chain: SupportedCoins): Wallet | undefined {
		return this.walletStore.chainWallet(this.profileId, chain)
	}
	get Name() {
		return this.walletStore.name(this.profileId)
	}
	Algorithm(chain: SupportedCoins | undefined) {
		return "secp256k1"
	}
	async PubKey(chain: SupportedCoins) {
		const wallet = await this.walletStore.chainWallet(this.profileId, chain)
		const key = wallet?.PubKey()
		return key ?? new Uint8Array()
	}
	async Sign(chain: SupportedCoins, signDoc: StdSignDoc, signerAddress?: string) {
		try
		{
			const wallet = this.walletStore.chainWallet(this.profileId, chain) as CosmosWallet
			const [address, signer] = await Promise.all([wallet.Address(), wallet.AminoSigner()])
			return await signer.signAmino(signerAddress ?? address, signDoc)
		}
		catch(e)
		{
			console.error("Catched", e)
		}

		return undefined
	}
}

export type DappConnection = {
	profileId: string,
	connector: WalletConnectConnectorV1<WalletConnectBaseEvents>
}

export default class DappConnectionStore {
	localStorageManager?: LocalStorageManager
	connections: DappConnection[] = []

	loading = {
	  checkNick: false,
	};

	async checkNick(nick: string) {
	  return true;
	}

	constructor(
		private walletStore: WalletStore,
		private chainsStore: ChainsStore,
		private remoteConfigsStore: RemoteConfigsStore,
		private settingsStore: SettingsStore)
	{
		makeAutoObservable(this, {}, { autoBind: true })
	}

	connect(pairString?: string)
	{
		if(this.walletStore.activeProfile)
		{
			this.addConnection(this.walletStore.activeProfile.id, pairString)
		}
		else
		{
			throw new Error("No active wallet to use in connection")
		}
	}

	restoreConnection(profileId: string, name: string, date: Date, session?: IWalletConnectSession)
	{
		this.addConnection(profileId, undefined, session, name, date)
	}

	private addConnection(profileId: string, pairString?: string, session?: IWalletConnectSession, name?: string, date?: Date)
	{
		try
		{
			const connector = new KeplrConnector(this.chainsStore.enabledCoins, {
				uri: pairString,
				session,
				fcmToken: this.settingsStore.notifications.enable ? this.remoteConfigsStore.pushNotificationToken : undefined,
				walletInterface: new StoreDrivenWalletInterface(this.walletStore, profileId),
				name,
				date,
			})
			const oldConnect = connector.events.connect
			connector.events.connect = (error, payload) =>
			{
				oldConnect(error, payload)
				this.onConnect()
			}
			const oldDisconnect = connector.events.disconnect
			connector.events.disconnect = (error, payload) =>
			{
				oldDisconnect(error, payload)
				this.onDisconnect(connector)
			}
			runInAction(() =>
			{
				
				this.connections.push(makeObservable({
					profileId,
					connector: makeObservable(connector, {
						name: observable,
						date: observable,
						setDate: action,
						setName: action,
					}),
				}, {
					connector: observable,
				}))
			})

			autorun(() =>
			{
				console.log(toJS(this.connections).map(c => ({name: c.connector.name, date: c.connector.date})))
			})
		}
		catch(e)
		{
			throw e
		}
	}

	async disconnect(connection: WalletConnectConnectorV1<WalletConnectBaseEvents>)
	{
		const connectionIndex = this.connections.findIndex(c => c.connector.connector?.key == connection.connector?.key)
		try
		{
			await connection.connector?.killSession()
		}
		catch(e){}
		if(connectionIndex >= 0)
		{
			this.connections.splice(connectionIndex, 1)
			this.saveConnections()
		}
	}

	private onConnect()
	{
		this.saveConnections()
	}

	private onDisconnect(connection: WalletConnectConnectorV1<WalletConnectBaseEvents>)
	{
		this.disconnect(connection)
	}

	private saveConnections()
	{
		if(this.localStorageManager) this.localStorageManager.saveConnections()
	}
}