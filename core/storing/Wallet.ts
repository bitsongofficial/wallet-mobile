import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { Wallet } from "core/types/storing/Generic";
import { Derivator } from "core/types/utils/derivator";
import { BaseDerivator } from "core/utils/Derivator";
import { MnemonicStore } from "./MnemonicStore";

class WalletToKeys extends BaseDerivator {
	protected async InnerDerive(data: any)
	{
		const wallet = data as DirectSecp256k1HdWallet
		const accounts = await wallet.getAccounts()
		return {
			public: accounts[0].address,
			private: wallet.privkey,
		}
	}
}

class MnemonicToWallet extends BaseDerivator {
	protected async InnerDerive(data: any)
	{
		return await DirectSecp256k1HdWallet.fromMnemonic(data, undefined, "bitsong")
	}
}

class MnemonicToKeys implements Derivator {
	Derive(data: any) {
		return (new MnemonicToWallet(new WalletToKeys())).Derive(data)
	}
}

export class CosmoWallet implements Wallet {
	constructor(private mnemonicStore: MnemonicStore, chain:string)
	{

	}
	async Address()
	{
		return (await this.Keys()).public
	}
	async Key()
	{
		return (await this.Keys()).private
	}

	private async Keys()
	{
		return await (new MnemonicToKeys()).Derive(await this.mnemonicStore.Get())
	}
}

const b = 5
export default b