import { Transaction } from "classes";
import { WalletConnectCosmosClientV1 } from "core/connection/WalletConnectV1";
import { makeAutoObservable } from "mobx";
import { openSendRecap } from "screens/SendModalScreens/OpenSendRecap";
import CoinStore from "./CoinStore";
import RemoteConfigsStore from "./RemoteConfigsStore";
import WalletStore from "./WalletStore";
import { IWalletConnectSession } from "@walletconnect/types"
import LocalStorageManager from "./LocalStorageManager";
import SettingsStore from "./SettingsStore";

export default class DappConnectionStore {
	localStorageManager?: LocalStorageManager
	connections: WalletConnectCosmosClientV1[] = []

	loading = {
	  checkNick: false,
	};

	async checkNick(nick: string) {
	  return true;
	}

	constructor(private walletStore: WalletStore, private coinStore: CoinStore, private remoteConfigsStore: RemoteConfigsStore, private settingsStore: SettingsStore)
	{
		makeAutoObservable(this, {}, { autoBind: true })
		// AsyncStorageLib.removeItem(session_location)
	}

	async connect(pairString?: string, session?: IWalletConnectSession, name?: string, date?: Date)
	{
		if(this.walletStore.activeWallet)
		{
			try
			{
				this.connections.push(new WalletConnectCosmosClientV1({
					uri: pairString,
					session,
					wallets: [this.walletStore.activeWallet.wallets.btsg],
					fcmToken: this.settingsStore.notifications.enable ? this.remoteConfigsStore.pushNotificationToken : undefined,
					onRequest: this.onRequest,
					onConnect: this.onConnect,
					onDisconnect: this.onDisconnect,
				}))
			}
			catch(e)
			{
				throw e
			}
		}
		else
		{
			throw new Error("No active wallet to use in connection")
		}
	}

	private onRequest(type: string, data: any, handler: acceptRejectType)
	{
		switch(type)
		{
			case "/cosmos.bank.v1beta1.MsgSend":
				const creater = new Transaction.Creater()
				creater.setAmount(this.coinStore.fromAmountToFiat(data.amount).toFixed(2))
				creater.addressInput.set(data.to)

				openSendRecap(creater, async () =>
				{
					await handler.accept()
					this.coinStore.updateBalances()
				}, handler.reject)
				break
		}
	}

	private onConnect(connection: WalletConnectCosmosClientV1)
	{
		if(this.localStorageManager) this.localStorageManager.saveConnections()
	}

	async disconnect(connection: WalletConnectCosmosClientV1)
	{
		try
		{
			await connection.connector?.killSession()
		}
		catch(e){}
		const connectionIndex = this.connections.indexOf(connection)
		if(connectionIndex >= 0)
		{
			this.connections.splice(connectionIndex, 1)
			if(this.localStorageManager) this.localStorageManager.saveConnections()
		}
	}

	private onDisconnect(connection: WalletConnectCosmosClientV1)
	{
		this.disconnect(connection)
	}
}
