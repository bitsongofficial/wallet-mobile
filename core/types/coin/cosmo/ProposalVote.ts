import { CosmoWallet } from "core/storing/Wallet";
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { Proposal } from "./Proposal";

export interface ProposalVote {
	voter: CosmoWallet,
	proposal: Proposal,
	choice: VoteOption,
}