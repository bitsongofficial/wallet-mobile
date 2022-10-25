export enum SupportedCoins {
	BITSONG = "btsg",
	BITSONG118 = "btsg118",
	OSMOSIS = "osmo",
	// JUNO = "juno",
	// ATOM = "cosmos",
	// STARGATE = "stars",
}

export type SupportedCoinsFullMap<T = any> = {
	[k in SupportedCoins]: T
}

export type SupportedCoinsMap<T = any> = {
	[k in SupportedCoins]?: T
}