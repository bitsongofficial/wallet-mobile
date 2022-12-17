import { SupportedCoins } from "constants/Coins";
import { CosmosCoin } from "core/coin/cosmos/CosmosCoin";
import { IBCCordinates } from "core/types/coin/Coin";
import { ChainIds, ChainRegistryNames } from "core/types/coin/Dictionaries";
import { getCoinIcon, getCoinPrefix, getIbcCoordinates } from "core/utils/Coin";

export enum ChainType {
	Cosmos
}

export interface Chain {
	type: ChainType,
	id: string,
	name: string,
	logo?: string,
	prefix?: string,
	defaultDenom: string,
	rpc: string,
	api: string,
}

export interface CosmosChain extends Chain {
	ibcCoordinates: (chainName: string) => IBCCordinates,
}

export class CodedCosmosChain implements CosmosChain{
	type = ChainType.Cosmos;
	id: string;
	name: string;
	logo?: string;
	prefix?: string;
	defaultDenom: string;
	rpc: string;
	api: string;

	constructor(public chain: CosmosCoin)
	{
		const chainIdentifier = chain.chain() as SupportedCoins
		const denom = chain.denom()
		this.id = ChainIds[chainIdentifier]
		this.name = ChainRegistryNames[chainIdentifier]
		this.logo = getCoinIcon(denom)
		this.prefix = getCoinPrefix(chainIdentifier)
		this.defaultDenom = denom
		this.rpc = chain.RPCEndpoint()
		this.api = chain.apiEndpoint()
	}
	ibcCoordinates(chainName: string)
	{
		return getIbcCoordinates(this.name, chainName)
	}
}