import { Wallet } from "core/types/storing/Generic";
import { Validator } from "./Validator";

export interface RewardsData {
	wallet: Wallet,
	validator?: Validator
}