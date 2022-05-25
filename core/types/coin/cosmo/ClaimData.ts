import { CosmoWallet } from "core/storing/Wallet";
import { Wallet } from "core/types/storing/Generic";

export interface ClaimData{
	owner: CosmoWallet,
	validators: Wallet[],
}