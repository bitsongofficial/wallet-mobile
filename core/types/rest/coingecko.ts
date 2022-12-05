import { SupportedFiats } from "core/utils/Coin";

export type Prices = Map<string, number>

export type CoingeckoPrice = {
	[key in SupportedFiats]? : number
}

export interface CoingeckoPrices {
	[key: string] : CoingeckoPrice
}