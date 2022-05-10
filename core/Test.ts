import { PinMnemonicStore } from "./storing/MnemonicStore"
import e, { CosmoWallet } from "./storing/Wallet"
import * as bip39 from "core/utils/bip39"
import { DirectSecp256k1HdWallet } from "./utils/cosmjs/cosmjs-proto-signing"

export async function test()
{
	const savePhase = false
	const memStore = new PinMnemonicStore('mnemonic', 123456)
	if(savePhase)
	{
		const a = 'label athlete actual wire index clean tobacco pelican search key west gain swift large rich'
		memStore.Set(a)
	}
	else
	{
		const b = await memStore.Get()
		console.log(b, await DirectSecp256k1HdWallet.fromMnemonic(b))
		// const wallet = new CosmoWallet(memStore, 'bitsong')
		// wallet.Address()
	}
}