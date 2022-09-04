import { CosmosWallet } from "core/storing/Wallet";
import { Amount } from "../Generic";
import { Proposal, ProposalType } from "./Proposal";

export interface SubmitProposalData {
	proposer: CosmosWallet,
	proposal: {
		title: string,
		description: string,
	},
	initialDeposit: Amount,
}