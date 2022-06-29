import { CosmosWallet } from "core/storing/Wallet"
import { Amount } from "core/types/coin/Generic"
import { Wallet } from "core/types/storing/Generic"

export interface FromToAmount {
	from: CosmosWallet,
	to: Wallet,
	amount: Amount | Amount[],
	description?: string,
}