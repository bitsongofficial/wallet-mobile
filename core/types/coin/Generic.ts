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
	OSMO = "osmo",
	UOSMO = "uosmo",
	BTSGN = "btsg",
	UBTSG = "ubtsg"
}

export interface Amount {
	denom: Denom | string,
	amount: string,
}