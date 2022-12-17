import { SupportedCoins } from "constants/Coins"
import { IBCCordinates } from "../Coin"
import { FromToAmount } from "./FromToAmount"

export interface FromToAmountIbc extends FromToAmount {
	destinationNetworkId: string,
	ibcCoordinates: IBCCordinates,
}