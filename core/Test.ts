import { PinMnemonicStore } from "./storing/MnemonicStore"
import e, { CosmoWallet } from "./storing/Wallet"

export async function test()
{
	const savePhase = false
	const memStore = new PinMnemonicStore('mnemonic', 123456)
	if(savePhase)
	{
		const a = 'label athlete actual wire index clean tobacco pelican search key west gain swift large rich'
		memStore.Set(a)
		console.log(a)
	}
	else
	{
		const b = await memStore.Get()

		const wallet = new CosmoWallet(memStore, 'bitsong')
		console.log(b, await wallet.Address(), await wallet.Key())
	}
}