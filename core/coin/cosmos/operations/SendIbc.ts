import { assertIsDeliverTxSuccess, GasPrice, SigningStargateClient } from "@cosmjs-rn/stargate";
import { FromToAmount } from "core/types/coin/cosmos/FromToAmount";
import Long from "long";
import { CosmosOperation } from "./CosmosOperation";

function ibcTimeout()
{
	const timeoutTimestamp = Math.floor(new Date().getTime() / 1000) + 600

	const timeoutTimestampNanoseconds = timeoutTimestamp
		? Long.fromNumber(timeoutTimestamp).multiply(1000000000)
		: undefined
	return timeoutTimestampNanoseconds?.toNumber()
}

export class SendIbc extends CosmosOperation {
	async Run(data: FromToAmount) {
		const wallet = await data.from.Signer()
		const [firstAccount] = await wallet.getAccounts()
		const client = await SigningStargateClient.connectWithSigner(this.coin.RPCEndpoint(), wallet, {
			gasPrice: GasPrice.fromString(this.coin.gasUnit()),
		})

		try
		{
			let result
			const srcAddress = firstAccount.address
			const destAddress = await data.to.Address()
			const amount = Array.isArray(data.amount) ? data.amount[0] : data.amount
			result = await client.sendIbcTokens(srcAddress, destAddress, amount, "transfer", "channel-0", undefined, ibcTimeout(), "auto", data.description)

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