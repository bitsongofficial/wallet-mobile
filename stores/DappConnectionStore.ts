import { WalletConnectCosmosClientV1 } from "core/connection/WalletConnectV1";
import { makeAutoObservable } from "mobx";
import WalletStore from "./WalletStore";

export default class DappConnectionStore {
	connection: WalletConnectCosmosClientV1 | null = null

	constructor(private walletStore: WalletStore,) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	async connect(pairString: string)
	{
		if(this.walletStore.activeWallet)
		{
			try
			{
				console.log(this.walletStore.activeWallet.wallets.btsg)
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
