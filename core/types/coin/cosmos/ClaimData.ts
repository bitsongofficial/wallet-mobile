import { CosmosWallet } from "core/storing/Wallet";
import { Wallet } from "core/types/storing/Generic";

export interface ClaimData{
	owner: CosmosWallet,
	validators: Wallet[],
}