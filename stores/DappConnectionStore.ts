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

export type ConnectionMeta = {
	name?: string,
	icon?: string,
	url?: string,
	description?: string,
	date: Date | null,
}

type SessionConnectionInfo = {
	session: IWalletConnectSession,
}

type PairStringConnectionInfo = {
	pairString: string,
}

export type ConnectionInfo = {
	session?: IWalletConnectSession,
	pairString?: string,
} & ({
	session: IWalletConnectSession,
} | {
	pairString: string,
})

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
		if(this.walletStore.activeProfile && pairString)
		{
			this.addConnection(this.walletStore.activeProfile.id, {pairString})
		}
		else
		{
			throw new Error("No active wallet to use in connection")
		}
	}

	restoreConnection(profileId: string, session: SessionConnectionInfo, connectionMeta?: ConnectionMeta)
	{
		this.addConnection(profileId, session, connectionMeta)
	}

	private addConnection(profileId: string, connectionInfo: ConnectionInfo, connectionMeta?: ConnectionMeta)
	{
		try
		{
			const connector = new KeplrConnector(this.chainsStore.enabledCoins, {
				uri: connectionInfo.pairString,
				session: connectionInfo.session,
				fcmToken: this.settingsStore.notifications.enable ? this.remoteConfigsStore.pushNotificationToken : undefined,
				walletInterface: new StoreDrivenWalletInterface(this.walletStore, profileId),
				meta: connectionMeta,
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
					connector: connector,
					type,
				}, {
					connector: observable,
				}))
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