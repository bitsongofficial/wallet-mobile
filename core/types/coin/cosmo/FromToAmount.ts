import { PublicWallet } from "core/storing/Generic"
import { CosmoWallet } from "core/storing/Wallet"
import { Amount } from "core/types/coin/Generic"

export interface FromToAmount {
	from: CosmoWallet,
	to: PublicWallet,
	amount: Amount,
	description?: string,
}