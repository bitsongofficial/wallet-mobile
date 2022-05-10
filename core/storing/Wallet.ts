import { Wallet } from "core/types/storing/Generic";
import { BaseDerivator } from "core/utils/Derivator";
import { MnemonicStore, PinMnemonicStore } from "./MnemonicStore";

class MnemonicToKeys extends BaseDerivator {
	protected async InnerDerive(data: any)
	{
		return data
	}
}

export class CosmoWallet implements Wallet {
	constructor(private mnemonicStore: MnemonicStore, chain:string)
	{

	}
	async Address()
	{
		const wallet = await (new MnemonicToKeys()).Derive(this.mnemonicStore.Get())
		console.log(wallet)
		return ""
	}
	async Key()
	{
		return ""
	}
}

const b = 5
export default b