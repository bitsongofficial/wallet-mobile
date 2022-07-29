import { CosmosWallet } from "core/storing/Wallet";
import { Wallet } from "core/types/storing/Generic";
import { Validator } from "./Validator";

export interface ClaimData{
	owner: CosmosWallet,
	validators: Validator[],
}