import { CosmosCoin } from "core/coin/cosmos/CosmosCoin";
import { ChainIds, ChainRegistryNames } from "core/types/coin/Dictionaries";

export interface Chain {
	name: string,
	id: string,
	rpc: string,
	api: string,
}

export class CodedCosmosChain implements Chain{
	name: string;
	id: string;
	rpc: string;
	api: string;

	constructor(public chain: CosmosCoin)
	{
		const chainIdentifier = chain.chain()
		this.name = ChainRegistryNames[chainIdentifier]
		this.id = ChainIds[chainIdentifier]
		this.rpc = chain.RPCEndpoint()
		this.api = chain.apiEndpoint()
	}
}