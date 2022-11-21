import axios, { Axios } from "axios"
import { SupportedCoins } from "constants/Coins"
import { Denom } from "core/types/coin/Generic"
import { CoinOperation, CoinOperationEnum, OperationMap } from "core/types/coin/OperationTypes"
import Config from "react-native-config"
import { CosmosCoin } from "./CosmosCoin"

export class AlternativeChain extends CosmosCoin {
	private innerExplorer: Axios
	constructor(private baseChain: CosmosCoin, private rpcEndpoint: string, explorerUrl: string)
	{
		super()
		this.innerExplorer = axios.create({
			baseURL: explorerUrl
		})
	}
	public chain(): SupportedCoins {
		return this.baseChain.chain()
	}
	public denom(): Denom {
		return this.baseChain.denom()
	}
	public explorer(): Axios {
		return this.innerExplorer
	}
	public RPCEndpoint(): string {
		return this.rpcEndpoint
	}
	public Do(operation: CoinOperation, params?: any): Promise<any> {
		return this.baseChain.Do(operation, params)
	}
}