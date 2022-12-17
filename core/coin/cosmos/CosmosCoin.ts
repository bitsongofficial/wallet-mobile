import axios, { Axios } from "axios"
import { SupportedCoins } from "constants/Coins"
import { ChainIndex } from "core/types/coin/Coin"
import { Denom } from "core/types/coin/Generic"
import { getCoinGasUnit } from "core/utils/Coin"
import { Coin } from "../Generic"

export abstract class CosmosCoin extends Coin {
	protected innerExplorer?: Axios
	public explorer(): Axios {
		if(this.innerExplorer === undefined) this.innerExplorer = axios.create({
			baseURL: this.apiEndpoint()
		})
		return this.innerExplorer
	}
	public gasUnit(): string
	{
		const gas = getCoinGasUnit(this.chain()) ?? "0.025" + this.denom()
		return gas
	}

	public abstract chain(): ChainIndex
	public abstract denom(): Denom | string
	public abstract apiEndpoint(): string
	public abstract RPCEndpoint(): string
}
