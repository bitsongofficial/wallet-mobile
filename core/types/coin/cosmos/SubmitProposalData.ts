import { CosmosWallet } from "core/storing/Wallet";
import { Amount } from "../Generic";

export interface SubmitProposalData {
	proposer: CosmosWallet,
	proposal: {
		title: string,
		description: string,
	},
	initialDeposit: Amount,
}