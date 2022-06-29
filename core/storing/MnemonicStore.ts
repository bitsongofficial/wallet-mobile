import { FakeCipher } from "core/cryptography/FakeCipher";
import { Cipher } from "core/types/cryptography/Generic";
import { MnemonicStore, Store, Vault } from "core/types/storing/Generic";
import { AESSaltStore, AESStore } from "./CipherStores";

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

export class AskPinMnemonicStore implements Vault, Store, MnemonicStore {
	pin: string = ""
	constructor(private field: string, private pinRequester: () => Promise<any>)
	{}
	Lock(): void {
		this.pin = ""
	}
	Unlock(pin: string): void {
		this.pin = pin
	}

	async Get() {
		return await this.withPin(async store => await store.Get())
	}

	async Set(data: string) {
		return await this.withPin(async store => await store.Set(data))
	}

	async askPin()
	{
		const pin = this.pin != "" ? this.pin : await this.pinRequester()
		return new AESSaltStore(this.field, pin)
	}

	async withPin(f: (store: Store) => void): Promise<any>
	{
		const store = await this.askPin()
		return await f(store)
	}
}