import { Bitsong } from "core/coin/bitsong/Bitsong";

export enum SupportedCoins {
	BITSONG = "btsg",
}

// JUNO = "juno",
// ATOM = "cosmos",
// OSMO = "osmo",
// STARGATE = "stars",

export const CoinClasses = {
	[SupportedCoins.BITSONG]: Bitsong
}