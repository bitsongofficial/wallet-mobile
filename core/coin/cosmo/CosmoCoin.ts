import { Coin } from "../Generic";

export abstract class CosmoCoin extends Coin {
	public abstract RPCEndpoint(): string
}
