import { Denom } from "core/types/coin/Generic";
import { Coin } from "../Generic";

export abstract class CosmosCoin extends Coin {
	public abstract RPCEndpoint(): string
	public abstract chain(): string
	public abstract denom(): Denom
}
