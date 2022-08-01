import { assertIsDeliverTxSuccess, GasPrice, MsgDepositEncodeObject, SigningStargateClient } from "@cosmjs-rn/stargate";
import { DepositData } from "core/types/coin/cosmos/DepositData";
import { MsgDeposit } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import { CosmosOperation } from "./CosmosOperation";

export class Deposit extends CosmosOperation {
	async Run(data: DepositData) {
		const walletInfos = await Promise.all(
			[
				data.depositor.Address(),
				data.depositor.Signer(),
			])
		const wallet = walletInfos[1]
		const client = await SigningStargateClient.connectWithSigner(this.coin.RPCEndpoint(), wallet, {
			gasPrice: GasPrice.fromString("0.001ubtsg"),
		})

		const message: MsgDepositEncodeObject = {
			typeUrl: "/cosmos.gov.v1beta1.MsgDeposit",
			value: {
				depositor: walletInfos[0],
				proposalId: data.proposal.id,
				amount: [data.amount],
			}
		}

		try
		{
			const result = await client.signAndBroadcast(walletInfos[0], [message], "auto", data.description)
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