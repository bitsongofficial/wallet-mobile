import { SupportedCoins, SupportedCoinsFullMap } from "constants/Coins";
import { Bitsong } from "core/coin/bitsong/Bitsong";
import { Bitsong118 } from "core/coin/bitsong118/Bitsong118";
import { CosmosCoin } from "core/coin/cosmos/CosmosCoin";
import { Osmosis } from "core/coin/osmosis/Osmosis";

export const CoinClasses: SupportedCoinsFullMap<CosmosCoin> = {
	[SupportedCoins.BITSONG]: new Bitsong(),
	[SupportedCoins.BITSONG118]: new Bitsong118(),
	[SupportedCoins.OSMOSIS]: new Osmosis(),
}

export const ChainRegistryNames: SupportedCoinsFullMap<string> = {
	[SupportedCoins.BITSONG]: "bitsong",
	[SupportedCoins.BITSONG118]: "bitsong",
	[SupportedCoins.OSMOSIS]: "osmosis",
}