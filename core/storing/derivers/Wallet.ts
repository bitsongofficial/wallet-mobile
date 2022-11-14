
import { stringToPath } from "@cosmjs-rn/crypto";
import { Secp256k1HdWallet } from "@cosmjs-rn/amino";
import { DirectSecp256k1HdWallet } from "@cosmjs-rn/proto-signing";
import { Derivator } from "core/types/utils/derivator";
import { BaseDerivator } from "core/utils/Derivator";

export class WalletToKeys extends BaseDerivator {
	protected async InnerDerive(data: any)
	{
		// console.log("WTK", data)
		const wallet = data as DirectSecp256k1HdWallet
		const accounts = await wallet.getAccounts()
		return {
			public: accounts[0].pubkey,
			address: accounts[0].address,
			private: new Uint8Array(),
		}
	}
}

export class MnemonicToHdWalletData extends BaseDerivator {
	constructor(private chain: string, private hdPath:string, derivator?: Derivator)
	{
		super(derivator)
	}
	protected async InnerDerive(data: any): Promise<any> {
		return {mnemonic: data, hdPath: this.hdPath, prefix: this.chain}
	}
}

export class HDWalletDataToWallet extends BaseDerivator {
	protected async InnerDerive(data: any)
	{
		try {
			return await DirectSecp256k1HdWallet.fromMnemonic(data.mnemonic, {
				hdPaths: [stringToPath(data.hdPath)],
				prefix: data.prefix
			})
		}
		catch(e)
		{
			return null
		}
	}
}

export class HDWalletDataToAminoSigner extends BaseDerivator {
	protected async InnerDerive(data: any)
	{
		try {
			return await Secp256k1HdWallet.fromMnemonic(data.mnemonic, {
				hdPaths: [stringToPath(data.hdPath)],
				prefix: data.prefix
			})
		}
		catch(e)
		{
			return null
		}
	}
}