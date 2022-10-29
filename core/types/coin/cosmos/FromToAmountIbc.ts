import { SupportedCoins } from "constants/Coins"
import { FromToAmount } from "./FromToAmount"

export interface FromToAmountIbc extends FromToAmount {
	destinationNetwork: SupportedCoins,
}