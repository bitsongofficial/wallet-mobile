import { stringToPath } from "@cosmjs-rn/crypto";
import { DirectSecp256k1HdWallet } from "@cosmjs-rn/proto-signing";
import { SupportedCoins } from "constants/Coins";
import { MnemonicToAminoSigner, MnemonicToWallet } from "core/types/storing/Cosmos";
import { CosmosWalletData, MnemonicStore, Store, Wallet } from "core/types/storing/Generic";
import { getCoinPrefix } from "core/utils/Coin";
import { HDWalletDataToAminoSigner, HDWalletDataToWallet, MnemonicToHdWalletData, WalletToKeys } from "./derivers/Wallet";

export async function mnemonicToAddress(mnemonic: string, chain: SupportedCoins) {
	const deriver = MnemonicToWalletGenerator.fromCosmosChain(chain)

	return (await (await deriver.Derive(mnemonic)).getAccounts())[0].address
}

function chainToDerivationPath(chain: SupportedCoins)
{
	switch(chain)
	{
		case SupportedCoins.BITSONG:
			return `m/44'/639'/0'/`
		default:
			return `m/44'/118'/0'/`
	}
}

function getWalletDataDeriver(chain: SupportedCoins)
{
	let chainSpecificDeriver = null
	const accountIndex = 0
	const walletIndex = 0
	const trailing = accountIndex + "/" + walletIndex
	switch(chain) {
		default:
			chainSpecificDeriver = new MnemonicToHdWalletData(getCoinPrefix(chain) ?? "", chainToDerivationPath(chain) + trailing)
	}

	return chainSpecificDeriver
}

const fromCosmosChain = function(chain: SupportedCoins) : HDWalletDataToWallet
{
	return new HDWalletDataToWallet(getWalletDataDeriver(chain))
}

const MnemonicToWalletGenerator = {
	fromCosmosChain,
	BitsongMnemonicToWallet: fromCosmosChain(SupportedCoins.BITSONG),
}

const aminoSignerfromCosmosChain = function(chain: SupportedCoins) : HDWalletDataToAminoSigner
{
	return new HDWalletDataToAminoSigner(getWalletDataDeriver(chain))
}

const MnemonicToAminoSignerGenerator = {
	fromCosmosChain: aminoSignerfromCosmosChain,
}

export class CosmosWallet implements Wallet {
	private address: string = ""
	constructor(private mnemonicStore: MnemonicStore, private accountDeriver: MnemonicToWallet, private aminoSignerDeriver: MnemonicToAminoSigner)
	{

	}
	async PubKey() {
		return (await this.Keys()).public as Uint8Array
	}
	async Address()
	{
		if(this.address == "") this.address = (await this.Keys()).address
		return this.address
	}
	async PrivateKey()
	{
		return (await this.Keys()).private as Uint8Array
	}
	async Mnemonic()
	{
		return (await this.mnemonicStore.Get())
	}

	private async Keys()
	{
		return await (new WalletToKeys(this.accountDeriver)).Derive(await this.mnemonicStore.Get())
	}

	async Signer()
	{
		return await this.accountDeriver.Derive(await this.Mnemonic())
	}

	async AminoSigner()
	{
		return await this.aminoSignerDeriver.Derive(await this.Mnemonic())
	}
}

const CosmosWalletFromChain = function(options: CosmosWalletData): CosmosWallet
{
	const store = options.store

	let directSignerDriver = MnemonicToWalletGenerator.fromCosmosChain(options.chain)
	let aminoSignerDeriver = MnemonicToAminoSignerGenerator.fromCosmosChain(options.chain)
	const w = new CosmosWallet(store, directSignerDriver, aminoSignerDeriver)
	return w
}

const CosmosWalletGenerator = {
	MnemonicFromChain: async function(chain: SupportedCoins, length: 12 | 15 | 18 | 21 | 24 = 15, accountIndex:number = 0, walletIndex:number = 0)
	{
		return (await DirectSecp256k1HdWallet.generate(length, {
			hdPaths:[stringToPath(chainToDerivationPath(chain) + accountIndex + "/" + walletIndex)],
			prefix: getCoinPrefix(chain)
		})).mnemonic
	},
	CosmosWalletFromChain,
	BitsongWallet: (store: Store) => CosmosWalletFromChain({
		chain: SupportedCoins.BITSONG,
		store,
	})
}

export {MnemonicToWalletGenerator, CosmosWalletGenerator}