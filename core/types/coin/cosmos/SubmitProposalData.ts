import { CosmosWallet } from "core/storing/Wallet";
import { Amount } from "../Generic";
import { Proposal } from "./Proposal";

export interface SubmitProposalData {
	proposer: CosmosWallet,
	proposal: Proposal,
	initialDeposit: Amount,
}