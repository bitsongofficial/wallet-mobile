import { CosmosCoin } from "core/coin/cosmos/CosmosCoin";
import { ChainIds, ChainRegistryNames } from "core/types/coin/Dictionaries";
import { getCoinIcon } from "core/utils/Coin";

export interface Chain {
	id: string,
	name: string,
	logo?: string,
	rpc: string,
	api: string,
}

export class CodedCosmosChain implements Chain{
	id: string;
	name: string;
	logo?: string;
	rpc: string;
	api: string;

	constructor(public chain: CosmosCoin)
	{
		const chainIdentifier = chain.chain()
		this.id = ChainIds[chainIdentifier]
		this.name = ChainRegistryNames[chainIdentifier]
		this.logo = getCoinIcon(chain.denom())
		this.rpc = chain.RPCEndpoint()
		this.api = chain.apiEndpoint()
	}
}