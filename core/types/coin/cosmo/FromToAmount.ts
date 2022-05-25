import { CosmoWallet } from "core/storing/Wallet"
import { Amount } from "core/types/coin/Generic"
import { Wallet } from "core/types/storing/Generic"

export interface FromToAmount {
	from: CosmoWallet,
	to: Wallet,
	amount: Amount,
	description?: string,
}