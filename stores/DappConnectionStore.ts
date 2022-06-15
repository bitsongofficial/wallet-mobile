import { WalletConnectCosmosClientV1 } from "core/connection/WalletConnectV1";
import { makeAutoObservable } from "mobx";
import WalletStore from "./WalletStore";

export default class DappConnectionStore {
	connection: WalletConnectCosmosClientV1 | null = null

	loading = {
	  checkNick: false,
	};
  
	async checkNick(nick: string) {
	  return true;
	}

	constructor(private walletStore: WalletStore,) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async connect(payload: string | { wcURI: string; sharedPassword: string })
	{	
		if(this.walletStore.activeWallet)
		{
			try
			{
				const pairString = typeof payload === 'object' ? payload.wcURI : payload

				this.connection = new WalletConnectCosmosClientV1(pairString, [this.walletStore.activeWallet.wallets.btsg])
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
