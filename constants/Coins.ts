export enum SupportedCoins {
	BITSONG = "btsg",
	// JUNO = "juno",
	// ATOM = "cosmos",
	// OSMO = "osmo",
	// STARGATE = "stars",
}

export type SupportedCoinsMap = {
	[k in SupportedCoins]?: any
}