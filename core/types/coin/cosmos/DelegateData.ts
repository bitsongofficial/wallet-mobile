import { CosmosWallet } from "core/storing/Wallet"
import { Amount } from "core/types/coin/Generic"
import { Validator } from "./Validator"

export interface DelegateData {
	delegator: CosmosWallet,
	validator: Validator,
	amount: Amount,
	description?: string,
}