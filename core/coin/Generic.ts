import { CoinOperation, OperationMap } from "core/types/coin/OperationTypes";

export class Coin {
	protected operations: OperationMap = {}
	public async Do(operation: CoinOperation, params?: any) {
		const requestOp = this.operations[operation]
		if(requestOp)
		{
			return await requestOp.Run(params)
		}
		else
		{
			throw new Error("Method not implemented.");
		}
		return false
	}
}