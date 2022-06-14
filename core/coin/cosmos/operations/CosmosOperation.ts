import { CosmosCoin } from "../CosmosCoin";

export abstract class CosmosOperation {
	protected coin: CosmosCoin
	constructor(coin: CosmosCoin)
	{
		this.coin = coin
	}
}