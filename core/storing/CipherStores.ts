import { AESCipher } from "core/cryptography/AES";
import { Cipher } from "core/types/cryptography/Generic";
import { Store } from "core/types/storing/Generic";
import { AsyncStore } from "./AsyncStore";

export abstract class CipherStore implements Store {
	constructor(public store: Store, public cipher: Cipher){}
	async Get()
	{
		return this.cipher.Decrypt(await this.store.Get())
	}
	async Set(data:any)
	{
		return await this.store.Set(this.cipher.Crypt(data))
	}
}

export class AESStore extends CipherStore {
	constructor(field: string, key: string)
	{
		super(new AsyncStore(field), new AESCipher(key))
	}
}