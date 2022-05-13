import { Bitsong } from "./coin/bitsong/Bitsong"
import { WalletConnectCosmoClient } from "./connection/WalletConnect"
import { WalletConnectCosmoClientV1 } from "./connection/WalletConnectV1"
import { PublicWallet } from "./storing/Generic"
import { PinMnemonicStore } from "./storing/MnemonicStore"
import { CosmoWalletGenerator } from "./storing/Wallet"
import { Denom } from "./types/coin/Generic"
import { CoinOperationEnum } from "./types/coin/OperationTypes"

export async function test()
{
	const savePhase = false
	// const [wallet, store] = CosmoWalletGenerator.BitsongWallet
	if(savePhase)
	{
		const a = 'man hungry enjoy price timber girl omit type absent target enrich butter'
		// store.Set(a)
		// console.log(a)
	}
	else
	{
		// console.log(await wallet.Address())
		// console.log(await CosmoWalletGenerator.MnemonicFromChain('bitsong'))
		// const pubWallet = new PublicWallet("bitsong1awlevuwqeqfnduxvc0xnn9cmnvhe8l6zdmesus")
		const pubWallet = new PublicWallet("bitsong1cp8fuvuwvtkfzzaqsf85c3d7u30gauu2cdh9fq")
		// const transaction = {
		// 	from: wallet,
		// 	to: pubWallet,
		// 	amount: {
		// 		denom: Denom.BTSGN,
		// 		amount: "1",
		// 	}
		// }

		try
		{
			//Bitsong.Do(CoinOperationEnum.Send, transaction)
			// const a = await Bitsong.Do(CoinOperationEnum.Balance, {wallet: pubWallet})
			// console.log(a)
			const pairString = 'wc:8caefe47-7adf-4bbc-a819-38441d1309ed@1?bridge=https%3A%2F%2Fy.bridge.walletconnect.org&key=6d8c314ab81d5f70c4365c3781e8c190d0844853dc5508210f6cf6a3ba78e144'
			const wc = new WalletConnectCosmoClientV1(pairString, [pubWallet])
		}
		catch(e)
		{
			console.log(e)
		}
	}
}