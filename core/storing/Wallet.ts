import { stringToPath } from "@cosmjs-rn/crypto";
import { DirectSecp256k1HdWallet } from "@cosmjs-rn/proto-signing";
import { SupportedCoins } from "constants/Coins";
import { MnemonicToWallet } from "core/types/storing/Cosmos";
import { CosmosWalletData, MnemonicStore, Wallet } from "core/types/storing/Generic";
import { Derivator } from "core/types/utils/derivator";
import { BaseDerivator } from "core/utils/Derivator";
import { AskPinMnemonicStore } from "./MnemonicStore";

function standardWalletName(name: string)
{
	return 'user_wallet_' + name
}

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

export async function mnemonicToAddress(mnemonic: string, chain: SupportedCoins) {
	const deriver = MnemonicToWalletGenerator.fromCosmosChain(chain)

	return (await (await deriver.Derive(mnemonic)).getAccounts())[0].address
}

function chainToDerivationPath(chain: SupportedCoins)
{
	switch(chain)
	{
		default:
			return `m/44'/639'/0'/`
	}
}

function chainToPrefix(chain: SupportedCoins)
{
	switch(chain)
	{
		default:
			return 'bitsong'
	}
}

const fromCosmosChain = function(chain: SupportedCoins) : HDWalletDataToWallet
{
	let chainSpecificDeriver = null
	const accountIndex = 0
	const walletIndex = 0
	const trailing = accountIndex + "/" + walletIndex
	switch(chain) {
		default:
			chainSpecificDeriver = new MnemonicToHdWalletData(chainToPrefix(chain), chainToDerivationPath(chain) + trailing)
	}

	return new HDWalletDataToWallet(chainSpecificDeriver)
}

const MnemonicToWalletGenerator = {
	fromCosmosChain,
	BitsongMnemonicToWallet: fromCosmosChain(SupportedCoins.BITSONG),
}

export class CosmosWallet implements Wallet {
	constructor(private mnemonicStore: MnemonicStore, private accountDeriver: MnemonicToWallet, public metadata?: any)
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

const CosmosWalletFromChain = function(options: CosmosWalletData): [CosmosWallet, MnemonicStore]
{
	const name = options.name ?? options.chain
	const s = new AskPinMnemonicStore(standardWalletName(name), async () => {return "123456"})

	let deriver = MnemonicToWalletGenerator.fromCosmosChain(options.chain)
	const w = new CosmosWallet(s, deriver, options.metadata)
	return [w, s]
}

const CosmosWalletGenerator = {
	MnemonicFromChain: async function(chain: SupportedCoins, length: 12 | 15 | 18 | 21 | 24 = 15, accountIndex:number = 0, walletIndex:number = 0)
	{
		return (await DirectSecp256k1HdWallet.generate(length, {
			hdPaths:[stringToPath(chainToDerivationPath(chain) + accountIndex + "/" + walletIndex)],
			prefix: chain
		})).mnemonic
	},
	CosmosWalletFromChain,
	BitsongWallet: CosmosWalletFromChain({chain: SupportedCoins.BITSONG})
}

export {MnemonicToWalletGenerator, CosmosWalletGenerator}