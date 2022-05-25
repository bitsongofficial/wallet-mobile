import { CosmoCoin } from "../CosmoCoin";

export abstract class CosmoOperation {
	protected coin: CosmoCoin
	constructor(coin: CosmoCoin)
	{
		this.coin = coin
	}
}