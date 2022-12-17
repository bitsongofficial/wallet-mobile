import { Secp256k1HdWallet, Secp256k1Wallet } from "@cosmjs-rn/amino";
import { stringToPath } from "@cosmjs-rn/crypto";
import { signArbitrary, verifyArbitrary } from "./cryptography/Signing";

export async function test()
{
	const payload = {
		domain: "test.com",
		expire_at: 1657293505
	}
	const fakePayload = {
		domain: "testa.com",
		expire_at: 1657293505
	}
	const wallet = await Secp256k1HdWallet.fromMnemonic("onion check wise range six laundry index tuition orchard broccoli climb permit",
	{
		hdPaths: [stringToPath(`m/44'/639'/0'/` + 0 + "/" + 0)],
		prefix: "bitsong",
	})
	const address = (await wallet.getAccounts())[0]
	console.log("Add", address.address)
	const signature = await signArbitrary(wallet, address.address, JSON.stringify(payload))
	console.log("Sign", signature)

	const verify = await verifyArbitrary(address.address, JSON.stringify(payload), signature)
	console.log("ver true", verify)


	const verifyFalse = await verifyArbitrary(address.address, JSON.stringify(fakePayload), signature)
	console.log("ver false", verifyFalse)
}