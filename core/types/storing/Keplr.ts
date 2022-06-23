export interface QRCodeSharedData {
	wcURI: string
	sharedPassword: string
}

export interface AddressBookData {
	name: string
	address: string
	memo: string
}

export interface WCExportKeyRingDatasResponse {
	encrypted: {
	  ciphertext: string;
	  iv: string;
	};
	addressBooks: { [chainId: string]: AddressBookData[] | undefined }
}

export type CoinTypeForChain = {
	[identifier: string]: number
}

export type BIP44HDPath = {
	account: number
	change: number
	addressIndex: number
}

export interface ExportKeyRingData {
	type: "mnemonic" | "privateKey";
	// If the type is private key, the key is encoded as hex.
	key: string
	coinTypeForChain: CoinTypeForChain
	bip44HDPath: BIP44HDPath
	meta: {
	  [key: string]: string
	}
  }