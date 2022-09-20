import { assertIsDeliverTxSuccess, GasPrice, MsgDepositEncodeObject, MsgSubmitProposalEncodeObject, SigningStargateClient } from "@cosmjs-rn/stargate";
import { DepositData } from "core/types/coin/cosmos/DepositData";
import { SubmitProposalData } from "core/types/coin/cosmos/SubmitProposalData";
import { TextProposal } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { MsgDeposit, MsgSubmitProposal } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import { CosmosOperation } from "./CosmosOperation";

export class SubmitProposal extends CosmosOperation {
	async Run(data: SubmitProposalData) {
		const walletInfos = await Promise.all(
			[
				data.proposer.Address(),
				data.proposer.Signer(),
			])
		const wallet = walletInfos[1]
		const client = await SigningStargateClient.connectWithSigner(this.coin.RPCEndpoint(), wallet, {
			gasPrice: GasPrice.fromString(this.coin.gasUnit()),
		})
		const message: MsgSubmitProposalEncodeObject = {
			typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal",
			value: MsgSubmitProposal.fromPartial({
				content: {
					typeUrl: "/cosmos.gov.v1beta1.TextProposal",
					value: TextProposal.encode(TextProposal.fromPartial({
						title: data.proposal.title,
						description: data.proposal.description,
					})).finish()
				},
				initialDeposit: [data.initialDeposit],
				proposer: walletInfos[0],
			})
		}

		try
		{
			const result = await client.signAndBroadcast(walletInfos[0], [message], "auto")
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