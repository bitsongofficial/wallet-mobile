import { CosmosWallet } from "core/storing/Wallet";
import { Amount } from "../Generic";
import { Proposal } from "./Proposal";

export interface DepositData {
	depositor: CosmosWallet,
	proposal: Proposal,
	amount: Amount,
	description?: string,
}