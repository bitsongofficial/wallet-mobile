import { assertIsDeliverTxSuccess, GasPrice, MsgVoteEncodeObject, SigningStargateClient } from "@cosmjs-rn/stargate";
import { ProposalVote } from "core/types/coin/cosmos/ProposalVote";
import { MsgVote } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import { CosmosOperation } from "./CosmosOperation";

export class Vote extends CosmosOperation {
	async Run(data: ProposalVote) {
		const walletInfos = await Promise.all(
		[
			data.voter.Address(),
			data.voter.Signer(),
		])
		const wallet = walletInfos[1]
		const client = await SigningStargateClient.connectWithSigner(this.coin.RPCEndpoint(), wallet, {
			gasPrice: GasPrice.fromString("0.001ubtsg"),
		})
		const message: MsgVote = {
			proposalId: data.proposal.id,
			voter: walletInfos[0],
			option: data.choice
		}

		const encodedMessage: MsgVoteEncodeObject = {
			typeUrl: "/cosmos.gov.v1beta1.MsgVote",
			value: message,
		}

		try
		{
			const result = await client.signAndBroadcast(walletInfos[0], [encodedMessage], "auto")
			assertIsDeliverTxSuccess(result)
				
			return true
		}
		catch(e)
		{
			console.error("Catched", e)
		}
		return false
	}
}