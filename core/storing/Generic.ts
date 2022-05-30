import {Wallet} from "core/types/storing/Generic"

export class PublicWallet implements Wallet {
	constructor(private publicAddress: string){}

	async Address()
	{
		return this.publicAddress
	}

	async Key()
	{
		return ""
	}
}