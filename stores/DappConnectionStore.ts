import { WalletConnectCosmosClientV1 } from "core/connection/WalletConnectV1";
import { Amount } from "core/types/coin/Generic";
import { fromAmountToDollars } from "core/utils/Coin";
import { makeAutoObservable } from "mobx";
import { openSendRecap } from "screens/SendModalScreens/OpenSendRecap";
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

	constructor(private walletStore: WalletStore, private remoteConfigsStore: RemoteConfigsStore) {
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

  async onRequest(
    type: string,
    data: { amount: Amount; to: string },
    handler: acceptRejectType
  ) {
    switch (type) {
      case "/cosmos.bank.v1beta1.MsgSend":
        openSendRecap({
          amount: fromAmountToDollars(
            data.amount,
            this.remoteConfigsStore.prices
          ).toFixed(2),
          to: data.to,

          // from: need default coin for send
          onDone: handler.accept,
          onReject: handler.reject,
        });
        break;
    }
  }
}
