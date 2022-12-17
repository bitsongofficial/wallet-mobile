import { SupportedCoins } from "constants/Coins";

export type ChainIndex = SupportedCoins | string

export type IBCCordinates = {
	port: string,
	channel: string,
}