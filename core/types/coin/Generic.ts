import { CoinOperation } from "./OperationTypes";

export interface Coin 
{
	Do(operation: CoinOperation, params:any): any
}

export interface Operation
{
	Run(data: any): any
}

export enum Denom {
	"ucosm",
	"btsg",
	"ubtsg"
}

export interface Amount {
	denom: Denom,
	amount: number,
}