import { SupportedCoins, SupportedCoinsFullMap } from "constants/Coins";
import { Bitsong } from "core/coin/bitsong/Bitsong";
import { BitsongTestnet } from "core/coin/bitsong/BitsongTestnet";
import { Bitsong118 } from "core/coin/bitsong118/Bitsong118";
import { Bitsong118Testnet } from "core/coin/bitsong118/Bitsong118Testnet";
import { CosmosCoin } from "core/coin/cosmos/CosmosCoin";
import { Osmosis } from "core/coin/osmosis/Osmosis";
import { OsmosisTestnet } from "core/coin/osmosis/OsmosisTestnet";
import Config from "react-native-config";

export const CoinClasses: SupportedCoinsFullMap<CosmosCoin> = {
	[SupportedCoins.BITSONG]: new Bitsong(),
	[SupportedCoins.BITSONG118]: new Bitsong118(),
	[SupportedCoins.OSMOSIS]: new Osmosis(),
	[SupportedCoins.BITSONG_TESTNET]: new BitsongTestnet(),
	[SupportedCoins.BITSONG118_TESTNET]: new Bitsong118Testnet(),
	[SupportedCoins.OSMOSIS_TESTNET]: new OsmosisTestnet(),
}

export const ChainRegistryNames: SupportedCoinsFullMap<string> = {
	[SupportedCoins.BITSONG]: "bitsong",
	[SupportedCoins.BITSONG118]: "bitsong",
	[SupportedCoins.OSMOSIS]: "osmosis",
	[SupportedCoins.BITSONG_TESTNET]: "bitsong",
	[SupportedCoins.BITSONG118_TESTNET]: "bitsong",
	[SupportedCoins.OSMOSIS_TESTNET]: "osmosis",
}

export const ChainIds: SupportedCoinsFullMap<string> = {
	[SupportedCoins.BITSONG]: Config.BITSONG_ID ?? "",
	[SupportedCoins.BITSONG118]: Config.BITSONG_ID ?? "",
	[SupportedCoins.OSMOSIS]: Config.OSMOSIS_ID ?? "",
	[SupportedCoins.BITSONG_TESTNET]: Config.BITSONG_TESTNET_ID ?? "",
	[SupportedCoins.BITSONG118_TESTNET]: Config.BITSONG_TESTNET_ID ?? "",
	[SupportedCoins.OSMOSIS_TESTNET]: Config.OSMOSIS_TESTNET_ID ?? "",
}