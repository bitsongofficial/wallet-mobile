import { Axios } from "axios"
import { SupportedCoins } from "constants/Coins"
import { Denom } from "core/types/coin/Generic"
import { getCoinGasUnit } from "core/utils/Coin"
import { Coin } from "../Generic"

export abstract class CosmosCoin extends Coin {
	public abstract chain(): SupportedCoins
	public abstract denom(): Denom
	public abstract apiEndpoint(): string
	public abstract explorer(): Axios
	public gasUnit(): string
	{
		const gas = getCoinGasUnit(this.chain()) ?? "0.025" + this.denom()
		return gas
	}
	public abstract RPCEndpoint(): string
}
