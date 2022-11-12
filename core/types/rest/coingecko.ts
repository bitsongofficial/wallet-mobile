import { SupportedCoins } from "constants/Coins";
import { SupportedFiats } from "core/utils/Coin";

export type Prices = {
	[k in SupportedCoins]?: number
}

export type CoingeckoPrice = {
	[key in SupportedFiats]? : number
}

export interface CoingeckoPrices {
	[key: string] : CoingeckoPrice
}