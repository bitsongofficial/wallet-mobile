import { FakeCipher } from "core/cryptography/FakeCipher";
import { Cipher } from "core/types/cryptography/Generic";
import { SecureStore, Store } from "core/types/storing/Generic";
import { AESStore } from "./CipherStores";

export interface MnemonicStore extends SecureStore {}

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