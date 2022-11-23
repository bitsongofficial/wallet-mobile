export enum SupportedCoins {
	BITSONG = "btsg",
	BITSONG118 = "btsg118",
	OSMOSIS = "osmo",
	BITSONG_TESTNET = "btsg_testnet",
	BITSONG118_TESTNET = "btsg118_testnet",
	OSMOSIS_TESTNET = "osmo_testnet",
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