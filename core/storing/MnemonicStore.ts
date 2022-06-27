import { FakeCipher } from "core/cryptography/FakeCipher";
import { Cipher } from "core/types/cryptography/Generic";
import { MnemonicStore, Store } from "core/types/storing/Generic";
import { AESStore } from "./CipherStores";

export class PinMnemonicStore implements Store, MnemonicStore {
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

export class AskPinMnemonicStore implements Store, MnemonicStore {
	store: AESStore;
	cipher: Cipher;
	constructor(private field: string, private pinRequester: () => Promise<any>, initialPin = "")
	{
		this.store = new AESStore(field, initialPin)
		this.cipher = new FakeCipher()
	}

	async Get() {
		await this.AskPin()
		return await this.store.Get()
	}

	async Set(data: string) {
		await this.AskPin()
		return await this.store.Set(data)
	}

	async AskPin()
	{
		// Ask Pin here
		const pin = await this.pinRequester()
		this.store = new AESStore(this.field, pin)
	}
}