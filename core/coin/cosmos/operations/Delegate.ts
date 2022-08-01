import { assertIsDeliverTxSuccess, GasPrice, SigningStargateClient } from "@cosmjs-rn/stargate";
import { DelegateData } from "core/types/coin/cosmos/DelegateData";
import { CosmosOperation } from "./CosmosOperation";

export class Delegate extends CosmosOperation {
	async Run(data: DelegateData) {
		const walletInfos = await Promise.all(
			[
				data.delegator.Address(),
				data.delegator.Signer(),
			])
		const wallet = walletInfos[1]
		const client = await SigningStargateClient.connectWithSigner(this.coin.RPCEndpoint(), wallet, {
			gasPrice: GasPrice.fromString("0.001ubtsg"),
		})

		try
		{
			const result = await client.delegateTokens(walletInfos[0], data.validator.operator, data.amount, "auto", data.description)
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