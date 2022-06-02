import { Denom } from "core/types/coin/Generic";
import { Coin } from "../Generic";

export abstract class CosmoCoin extends Coin {
	public abstract RPCEndpoint(): string
	public abstract chain(): string
	public abstract denom(): Denom
}
