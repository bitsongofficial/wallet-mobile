import uuid from 'react-native-uuid'
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

export class AESSaltStore implements Store {
	asyncStore: AsyncStore
	salt: string | number[] = ""
	constructor(field: string, private key: string)
	{
		this.asyncStore = new AsyncStore(field)
	}
	async getSalt()
	{
		try
		{
			return (await this.asyncStore.Get()).salt
		}
		catch(e)
		{
			console.log("no salt")
		}
		if(this.salt == "") this.salt = uuid.v4()
		return this.salt
	}
	async getCipher()
	{
		const salt = await this.getSalt()
		return new AESCipher(this.key + salt)
	}

	async Get()
	{
		try
		{
			const [saltedData, aesCipher] = await Promise.all([this.asyncStore.Get(), this.getCipher()])
			return aesCipher.Decrypt(saltedData.data)
		}
		catch(e)
		{
			console.log("empty")
		}

		return ""
	}

	async Set(data: any)
	{
		const [salt, aesCipher] = await Promise.all([this.getSalt(), this.getCipher()])
		const saltedData = {
			data: aesCipher.Crypt(data),
			salt,
		}
		this.asyncStore.Set(saltedData)
		return true
	}
}