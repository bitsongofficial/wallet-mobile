import axios, { Axios } from "axios"
import { SupportedCoins } from "constants/Coins"
import { ChainIndex } from "core/types/coin/Coin"
import { Denom } from "core/types/coin/Generic"
import { CoinOperation, CoinOperationEnum, OperationMap } from "core/types/coin/OperationTypes"
import Config from "react-native-config"
import { CosmosCoin } from "./CosmosCoin"

export class AlternativeChain extends CosmosCoin {
	constructor(private baseChain: CosmosCoin, private rpcEndpoint: string, private explorerUrl: string)
	{
		super()
	}
	public apiEndpoint(): string {
		return this.explorerUrl
	}
	public chain(): ChainIndex {
		return this.baseChain.chain()
	}
	public denom(): Denom | string {
		return this.baseChain.denom()
	}
	public RPCEndpoint(): string {
		return this.rpcEndpoint
	}
	public Do(operation: CoinOperation, params?: any): Promise<any> {
		return this.baseChain.Do(operation, params)
	}
}