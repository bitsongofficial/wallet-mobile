import { Axios } from "axios"
import { Denom } from "core/types/coin/Generic"
import { Coin } from "../Generic"

export abstract class CosmosCoin extends Coin {
	public abstract chain(): string
	public abstract denom(): Denom
	public abstract explorer(): Axios
	public abstract RPCEndpoint(): string
}
