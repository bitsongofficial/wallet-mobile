import { AminoMsgSend, assertIsDeliverTxSuccess, GasPrice, SigningStargateClient } from "@cosmjs-rn/stargate";
import { FromToAmount } from "core/types/coin/cosmos/FromToAmount";
import { Denom, Operation } from "core/types/coin/Generic";
import { getPrefixFromAddress } from "core/utils/Address";
import Long from "long";
import { CosmosOperation } from "./CosmosOperation";

export async function getSendMessage(data: FromToAmount): Promise<AminoMsgSend>
{
	const addresses = await Promise.all([
		data.from.Address(),
		data.to.Address()
	])
	return {
		type: "cosmos-sdk/MsgSend",
		value: {
			from_address: addresses[0],
			to_address: addresses[1],
			amount: Array.isArray(data.amount) ? data.amount : [data.amount]
		}
	}
}

export class Send extends CosmosOperation {
	async Run(data: FromToAmount) {
		const wallet = await data.from.Signer()
		const [firstAccount] = await wallet.getAccounts();
		const client = await SigningStargateClient.connectWithSigner(this.coin.RPCEndpoint(), wallet, {
			gasPrice: GasPrice.fromString(this.coin.gasUnit()),
		})

		try
		{
			let result
			const srcAddress = firstAccount.address
			const destAddress = await data.to.Address()
			const amount = Array.isArray(data.amount) ? data.amount : [data.amount]
			console.log(srcAddress, destAddress, amount, data)
			result = await client.sendTokens(srcAddress, destAddress, amount, "auto", data.description)

			assertIsDeliverTxSuccess(result)
			return {
				hash: result.transactionHash
			}
		}
		catch(e)
		{
			console.error("Catched", e)
		}
		return false
	}
}