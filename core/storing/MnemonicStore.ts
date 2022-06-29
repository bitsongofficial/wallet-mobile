import { AESCipher } from "core/cryptography/AES";
import { FakeCipher } from "core/cryptography/FakeCipher";
import { Cipher } from "core/types/cryptography/Generic";
import { MnemonicStore, SecureStore, Store } from "core/types/storing/Generic";
import { AsyncStore } from "./AsyncStore";
import { AESStore } from "./CipherStores";

export class PinMnemonicStore implements SecureStore, MnemonicStore {
	store: Store;
	cipher: Cipher;
	constructor(field: string, pin: number)
	{
		this.store = new AESStore(field, pin.toString())
		this.cipher = new FakeCipher()
	}

	async Get() {
		return await this.store.Get()
	}

	async Set(data: string) {
		return await this.store.Set(data)
	}
}

export class AskPinMnemonicStore implements SecureStore, MnemonicStore {
	store: AESStore;
	cipher: Cipher;
	private firstStore = false;
	private firstGet = false;
	constructor(private field: string, private pinRequester: () => Promise<any>, initialPin = "")
	{
		if(initialPin)
		{
			this.firstStore = true
			this.firstGet = true
		}
		console.log(initialPin, typeof initialPin)
		this.store = new AESStore(field, initialPin)
		this.cipher = new FakeCipher()
	}

	async Get() {
		if(this.firstGet)
		{
			this.firstGet = false
		}
		else
		{
			await this.AskPin()
		}
		const data = await this.store.Get()
		console.log("key", (this.store.cipher as AESCipher).key)
		console.log(data)
		return data
	}

	async Set(data: string) {
		if(this.firstStore)
		{
			this.firstStore = false
		}
		else
		{
			await this.AskPin()
		}
		console.log("key", (this.store.cipher as AESCipher).key)
		return await this.store.Set(data)
	}

	async AskPin()
	{
		const pin = await this.pinRequester()
		console.log(pin, typeof pin)
		this.store = new AESStore(this.field, pin)
	}
}