import { SupportedCoins } from 'constants/Coins';
import {Cipher} from 'core/types/cryptography/Generic'

export interface Metadata {
	metadata?: any,
}

export interface Store {
	Get(): Promise<any>,
	Set(data: any): Promise<boolean>,
}

export interface Vault {
	Lock(): void,
	Unlock(pin: string): void,
}

export interface WalletData {
	name?: string,
	metadata?: any,
}

export interface CosmosWalletData extends WalletData {
	chain: SupportedCoins,
	store: Store
	pin?: string,
}

export interface Wallet extends Metadata {
	Address(): Promise<string>,
	PubKey(): Promise<Uint8Array>,
	PrivateKey(): Promise<Uint8Array>,
}

export interface MnemonicStore extends Store {}

export enum WalletTypes {
	UNDEFINED,
	COSMOS,
	WATCH,
}