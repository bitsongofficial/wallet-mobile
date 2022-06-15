import { WalletConnectCosmosClientV1 } from "core/connection/WalletConnectV1";
import { makeAutoObservable } from "mobx";
import RemoteConfigsStore from "./RemoteConfigsStore";
import WalletStore from "./WalletStore";

export default class DappConnectionStore {
	connection: WalletConnectCosmosClientV1 | null = null

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
				this.connection = new WalletConnectCosmosClientV1(pairString, [this.walletStore.activeWallet.wallets.btsg], this.remoteConfigsStore.pushNotificationToken)
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
}
