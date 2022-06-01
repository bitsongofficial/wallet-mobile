import {Cipher} from 'core/types/cryptography/Generic'

export interface Metadata {
	metadata?: any,
}

export interface Store {
	Get(): Promise<any>,
	Set(data: any): Promise<boolean>,
}

export interface Wallet extends Metadata {
	Address(): Promise<string>,
	Key(): Promise<string>,
}

export interface SecureStore extends Store {
	store: Store,
	cipher: Cipher,
}