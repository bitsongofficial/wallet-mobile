import { Coin as CoinInterface } from "core/types/coin/Generic";
import { CoinOperation } from "core/types/coin/OperationTypes";

export class Coin {
	protected static operations: any = {}
	public static async Do(operation: CoinOperation, params: any) {
		if(operation in this.operations)
		{
			return await this.operations[operation](params)
		}
		else
		{
			throw new Error("Method not implemented.");
		}
		return false
	}
	
}