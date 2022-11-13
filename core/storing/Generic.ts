import {Wallet} from "core/types/storing/Generic"

export class PublicWallet implements Wallet {
	constructor(private address: string, private pubKey?: Uint8Array){}
	async PubKey() {
		return this.pubKey ?? new Uint8Array()
	}
	async PrivateKey()
	{
		return new Uint8Array()
	}
	async Address()
	{
		return this.address
	}
}