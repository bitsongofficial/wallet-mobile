export interface CoingeckoPrice {
	eur?: number,
	usd?: number,
}

export interface CoingeckoPrices {
	[key: string] : CoingeckoPrice
}