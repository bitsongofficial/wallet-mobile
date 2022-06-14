import {Wallet} from "core/types/storing/Generic"

export class PublicWallet implements Wallet {
	constructor(private address: string){}

	async Address()
	{
		return this.address
	}

	async Key()
	{
		return ""
	}
}