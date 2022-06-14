import { CosmosWallet } from "core/storing/Wallet"
import { Wallet } from "core/types/storing/Generic"
import { Amount } from "core/types/coin/Generic"

export interface DelegateData {
	delegator: CosmosWallet,
	validator: Wallet,
	amount: Amount,
	description?: string,
}