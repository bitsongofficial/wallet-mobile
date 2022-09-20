import { SupportedCoins, SupportedCoinsFullMap } from "constants/Coins";
import { Bitsong } from "core/coin/bitsong/Bitsong";
import { CosmosCoin } from "core/coin/cosmos/CosmosCoin";
import { Coin } from "core/coin/Generic";

export const CoinClasses: SupportedCoinsFullMap<CosmosCoin> = {
	[SupportedCoins.BITSONG]: new Bitsong()
}

export const ChainRegistryNames: SupportedCoinsFullMap<string> = {
	[SupportedCoins.BITSONG]: "bitsong"
}