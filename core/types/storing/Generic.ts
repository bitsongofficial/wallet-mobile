import {Cipher} from 'core/types/cryptography/Generic'

export interface Store {
	Get(): Promise<any>,
	Set(data: any): Promise<boolean>,
}

export interface Wallet {
	Address(): Promise<string>,
	Key(): Promise<string>,
}

export interface SecureStore extends Store {
	store: Store,
	cipher: Cipher,
}