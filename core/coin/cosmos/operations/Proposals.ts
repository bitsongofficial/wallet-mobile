import { assertIsDeliverTxSuccess, GasPrice, SigningStargateClient } from "@cosmjs-rn/stargate";
import axios from "axios";
import { DelegateData } from "core/types/coin/cosmos/DelegateData";
import { Proposal, ProposalType } from "core/types/coin/cosmos/Proposal";
import { ProposalStatus } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import Long from "long";
import { CosmosOperation } from "./CosmosOperation";

function fromProposalUriToType(uri: string)
{
	const typeStringArray = uri.split('.')
	const typeString = typeStringArray[typeStringArray.length - 1]
	switch(typeString)
	{
		case "ParameterChangeProposal":
			return ProposalType.PARAMETER_CHANGE
		case "SoftwareUpgradeProposal":
			return ProposalType.SOFTWARE_UPGRADE
		case "TextProposal":
			return ProposalType.TEXT
		case "CommunityPoolSpendProposal":
			return ProposalType.TREASURY
	}
	return ProposalType.UNSUPPORTED
}

export class Proposals extends CosmosOperation {
	async Run() {
		try
		{
			const service = this.coin.explorer()
			const rawProposals = (await service.get("cosmos/gov/v1beta1/proposals")).data.proposals
			const proposals = rawProposals.map((p:any):Proposal =>
				({
					id: Long.fromString(p.proposal_id),
					type: fromProposalUriToType(p.content['@type']),
					title: p.content.title,
					description: p.content.description,
					status: Object.entries(ProposalStatus).find(e => e[0] == p.status)?.[1] as ProposalStatus,
					voting: {
						start: new Date(p.voting_start_time),
						end: new Date(p.voting_end_time),
					},
					result: {
						yes: parseInt(p.final_tally_result.yes),
						abstain: parseInt(p.final_tally_result.abstain),
						no: parseInt(p.final_tally_result.no),
						noWithZero: parseInt(p.final_tally_result.no_with_veto),
					},
					submit: new Date(p.submit_time),
					deposit: new Date(p.deposit_end_time),

				}))
			return proposals
		}
		catch(e)
		{
			console.error("Catched", e)
		}
		return []
	}
}