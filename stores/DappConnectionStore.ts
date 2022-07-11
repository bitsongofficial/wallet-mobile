import { Transaction } from "classes";
import { WalletConnectCosmosClientV1 } from "core/connection/WalletConnectV1";
import { fromAmountToDollars } from "core/utils/Coin";
import { makeAutoObservable } from "mobx";
import { openSendRecap } from "screens/SendModalScreens/OpenSendRecap";
import CoinStore from "./CoinStore";
import RemoteConfigsStore from "./RemoteConfigsStore";
import WalletStore from "./WalletStore";

export default class DappConnectionStore {
	connections: WalletConnectCosmosClientV1[] = []

	loading = {
	  checkNick: false,
	};
  
	async checkNick(nick: string) {
	  return true;
	}

	constructor(private walletStore: WalletStore, private coinStore: CoinStore, private remoteConfigsStore: RemoteConfigsStore) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async connect(pairString: string)
	{
		if(this.walletStore.activeWallet)
		{
			try
			{
				this.connections.push(new WalletConnectCosmosClientV1(pairString,
					[this.walletStore.activeWallet.wallets.btsg],
					this.remoteConfigsStore.pushNotificationToken,
					this.onRequest))
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
}
