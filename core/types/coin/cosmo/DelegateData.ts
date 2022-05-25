import { CosmoWallet } from "core/storing/Wallet"
import { Wallet } from "core/types/storing/Generic"
import { Amount } from "core/types/coin/Generic"

export interface DelegateData {
	delegator: CosmoWallet,
	validator: Wallet,
	amount: Amount,
	description?: string,
}