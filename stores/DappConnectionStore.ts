import { makeAutoObservable } from "mobx";
import CoinStore from "./CoinStore";
import RemoteConfigsStore from "./RemoteConfigsStore";
import WalletStore from "./WalletStore";
import { IWalletConnectSession } from "@walletconnect/types"
import LocalStorageManager from "./LocalStorageManager";
import SettingsStore from "./SettingsStore";
import ValidatorStore from "./ValidatorStore";
import { SupportedCoins } from "constants/Coins";
import ProposalsStore from "./ProposalsStore";
import { WalletConnectBaseEvents, WalletConnectConnectorV1, WalletInterface } from "core/connection/WalletConnect/ConnectorV1";
import { Wallet } from "core/types/storing/Generic";
import { CosmosWallet } from "core/storing/Wallet";
import { KeplrConnector } from "core/connection/WalletConnect/KeplrConnector";
import { StdSignDoc } from "@cosmjs-rn/amino";

class StoreDrivenWalletInterface implements WalletInterface {
	constructor(private walletStore: WalletStore, private profileId: string) {}
	async Address(chain: SupportedCoins) {
		return await this.walletStore.address(this.profileId, chain) ?? ""
	}
	Wallet(chain: SupportedCoins): Wallet {
		throw new Error("Method not implemented.");
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
		private coinStore: CoinStore,
		private validatorsStore: ValidatorStore,
		private proposalsStore: ProposalsStore,
		private remoteConfigsStore: RemoteConfigsStore,
		private settingsStore: SettingsStore)
	{
		makeAutoObservable(this, {}, { autoBind: true })
		// AsyncStorageLib.removeItem(session_location)
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
			const connector = new KeplrConnector(this.remoteConfigsStore.enabledCoins, {
				uri: pairString,
				session,
				fcmToken: this.settingsStore.notifications.enable ? this.remoteConfigsStore.pushNotificationToken : undefined,
				walletInterface: new StoreDrivenWalletInterface(this.walletStore, profileId)
			})
			const oldConnect = connector.events.connect
			connector.events.connect = (error, payload) =>
			{
				this.onConnect()
				oldConnect(error, payload)
			}
			const oldDisconnect = connector.events.disconnect
			connector.events.disconnect = (error, payload) =>
			{
				this.onDisconnect(connector)
				oldDisconnect(error, payload)
			}
			this.connections.push({
				profileId,
				connector
			})
		}
		catch(e)
		{
			throw e
		}
	}

	async disconnect(connection: WalletConnectConnectorV1<WalletConnectBaseEvents>)
	{
		try
		{
			await connection.connector?.killSession()
		}
		catch(e){}
		const connectionIndex = this.connections.findIndex(c => c.connector == connection)
		if(connectionIndex >= 0)
		{
			this.connections.splice(connectionIndex, 1)
			if(this.localStorageManager) this.localStorageManager.saveConnections()
		}
	}

	private onConnect()
	{
		if(this.localStorageManager) this.localStorageManager.saveConnections()
	}

	private onDisconnect(connection: WalletConnectConnectorV1<WalletConnectBaseEvents>)
	{
		this.disconnect(connection)
	}
}