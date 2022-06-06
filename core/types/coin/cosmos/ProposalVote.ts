import { CosmosWallet } from "core/storing/Wallet";
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { Proposal } from "./Proposal";

export interface ProposalVote {
	voter: CosmosWallet,
	proposal: Proposal,
	choice: VoteOption,
}