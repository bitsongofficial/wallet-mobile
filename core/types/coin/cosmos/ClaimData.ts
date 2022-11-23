import { CosmosWallet } from "core/storing/Wallet";
import { Validator } from "./Validator";

export interface ClaimData{
	owner: CosmosWallet,
	validators: Validator[],
}