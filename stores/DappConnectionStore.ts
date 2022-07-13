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

	async connect(pairString?: string, session?: IWalletConnectSession)
	{
		// See if it can be checked between pair string and session
		// if(!this.uris.find(u => u == pairString)) runInAction(() =>
		// {
		// 	this.uris.push(pairString)
		// })
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

	onRequest(type: string, data: any, handler: acceptRejectType)
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

	onConnect(connection: WalletConnectCosmosClientV1)
	{
		if(this.localStorageManager) this.localStorageManager.saveConnections()
	}

	onDisconnect(connection: WalletConnectCosmosClientV1)
	{
		this.connections.splice(this.connections.indexOf(connection), 1)
		if(this.localStorageManager) this.localStorageManager.saveConnections()
	}
}
