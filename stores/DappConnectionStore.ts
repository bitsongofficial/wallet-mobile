import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { Transaction, Wallet } from "classes";
import { WalletConnectCosmosClientV1 } from "core/connection/WalletConnectV1";
import { fromAmountToDollars } from "core/utils/Coin";
import { autorun, makeAutoObservable, reaction } from "mobx";
import { openSendRecap } from "screens/SendModalScreens/OpenSendRecap";
import CoinStore from "./CoinStore";
import RemoteConfigsStore from "./RemoteConfigsStore";
import WalletStore from "./WalletStore";
import { IWalletConnectSession } from "@walletconnect/types"

const session_location = "wc_sessions"

export default class DappConnectionStore {
	connections: WalletConnectCosmosClientV1[] = []
	firstLoadHandler

	loading = {
	  checkNick: false,
	};

	async checkNick(nick: string) {
	  return true;
	}

	constructor(private walletStore: WalletStore, private coinStore: CoinStore, private remoteConfigsStore: RemoteConfigsStore)
	{
		makeAutoObservable(this, {}, { autoBind: true })

		// AsyncStorageLib.removeItem(session_location)
		this.firstLoadHandler = autorun(() =>
		{
			if(this.walletStore.activeWallet)
			{
				this.load()
				this.firstLoadHandler()
			}
		})
	}

	async load()
	{
		try
		{
			const storedSessions = await AsyncStorageLib.getItem(session_location)
			if(storedSessions)
			{
				const sessions = JSON.parse(storedSessions) as IWalletConnectSession[]
				sessions.forEach(session => {
					this.connect(undefined, session)
				})
			}
		}
		catch(e)
		{
			console.log("load to large", e)
		}
		reaction(
			() => JSON.stringify(this.connections.filter(c => c.connector != undefined).map(c => c.connector?.session)),
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

	save()
	{
		const raw = JSON.stringify(this.connections.filter(c => c.connector != null).map(c => c.connector?.session))
		console.log(raw)
		try {
			AsyncStorageLib.setItem(session_location, raw)
		}
		catch(e)
		{
			console.log("save to large", e)
		}
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
					fcmToken: this.remoteConfigsStore.pushNotificationToken,
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
				creater.setAmount(fromAmountToDollars(data.amount, this.remoteConfigsStore.prices).toFixed(2))
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
		this.save()
	}

	onDisconnect(connection: WalletConnectCosmosClientV1)
	{
		this.connections.splice(this.connections.indexOf(connection), 1)
		this.save()
	}
}
