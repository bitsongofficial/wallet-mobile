import { PinMnemonicStore } from "./storing/MnemonicStore"
import { CosmoWalletGenerator } from "./storing/Wallet"

export async function test()
{
	const savePhase = false
	const [wallet, store] = CosmoWalletGenerator.BitsongWallet
	if(savePhase)
	{
		const a = 'man hungry enjoy price timber girl omit type absent target enrich butter'
		store.Set(a)
		// console.log(a)
	}
	else
	{
		console.log(await wallet.Address()/*, await wallet.Key()*/)
		console.log(await wallet.Signer())
	}
}