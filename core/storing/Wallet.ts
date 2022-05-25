import { stringToPath } from "@cosmjs/crypto";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { MnemonicToWallet } from "core/types/storing/Cosmo";
import { Wallet } from "core/types/storing/Generic";
import { Derivator } from "core/types/utils/derivator";
import { BaseDerivator } from "core/utils/Derivator";
import { AskPinMnemonicStore, MnemonicStore, PinMnemonicStore } from "./MnemonicStore";

class WalletToKeys extends BaseDerivator {
	protected async InnerDerive(data: any)
	{
		// console.log("WTK", data)
		const wallet = data as DirectSecp256k1HdWallet
		const accounts = await wallet.getAccounts()
		return {
			public: accounts[0].address,
			private: ""//wallet.privkey,
		}
	}
}

class MnemonicToHdWalletData extends BaseDerivator {
	constructor(private chain: string, private hdPath:string, derivator?: Derivator)
	{
		super(derivator)
	}
	protected async InnerDerive(data: any): Promise<any> {
		return {mnemonic: data, hdPath: this.hdPath, prefix: this.chain}
	}
}

class HDWalletDataToWallet extends BaseDerivator {
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

function chainToDerivationPath(chain: string)
{
	switch(chain)
	{
		default:
			return `m/44'/639'/0'/`
	}
}

const MnemonicToWalletGenerator:any = {}
MnemonicToWalletGenerator.fromCosmoChain = function(chain: string)
{
	let chainSpecificDeriver = null
	const accountIndex = 0
	const walletIndex = 0
	const trailing = accountIndex + "/" + walletIndex
	switch(chain) {
		default:
			chainSpecificDeriver = new MnemonicToHdWalletData('bitsong', chainToDerivationPath(chain) + trailing)
	}

	return new HDWalletDataToWallet(chainSpecificDeriver)
}
MnemonicToWalletGenerator.BitsongMnemonicToWallet = MnemonicToWalletGenerator.fromCosmoChain('bitsong')

export class CosmoWallet implements Wallet {
	constructor(private mnemonicStore: MnemonicStore, private accountDeriver: MnemonicToWallet)
	{

	}
	async Address()
	{
		return (await this.Keys()).public
	}
	async Key()
	{
		return (await this.Keys()).private
	}

	private async Keys()
	{
		return await (new WalletToKeys(this.accountDeriver)).Derive(await this.mnemonicStore.Get())
	}

	async Signer()
	{
		return await this.accountDeriver.Derive(await this.mnemonicStore.Get())
	}
}

const CosmoWalletGenerator: any = {
	MnemonicFromChain: async function(chain: string, length: 12 | 15 | 18 | 21 | 24 = 15, accountIndex:number = 0, walletIndex:number = 0)
	{
		return (await DirectSecp256k1HdWallet.generate(length, {
			hdPaths:[stringToPath(chainToDerivationPath(chain) + accountIndex + "/" + walletIndex)],
			prefix: chain
		})).mnemonic
	}
}
CosmoWalletGenerator.CosmoWalletFromChain = function(chain: string): [CosmoWallet, MnemonicStore]
{
	const s = new PinMnemonicStore('user_wallet_' + chain, 123456)

	let deriver = MnemonicToWalletGenerator.fromCosmoChain(chain)
	const w = new CosmoWallet(s, deriver)
	return [w, s]
}
CosmoWalletGenerator.BitsongWallet = CosmoWalletGenerator.CosmoWalletFromChain('bitsong')

export {MnemonicToWalletGenerator, CosmoWalletGenerator}