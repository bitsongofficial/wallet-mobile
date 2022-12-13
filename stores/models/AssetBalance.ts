import { AssetIndex } from "core/types/coin/Assets";
import { Amount } from "core/types/coin/Generic";
import { makeAutoObservable } from "mobx";

export interface AssetBalance {
	denom: AssetIndex,
	chain: string,
	balance: number,
}

export class ObservableAssetBalance implements AssetBalance {
	denom: AssetIndex
	chain: string
	balance: number
	constructor(balance: AssetBalance)
	{
		this.chain = balance.chain
		this.denom = balance.denom
		this.balance = balance.balance
		makeAutoObservable(this)
	}

	static fromChainAmount(chain: string, amount: Amount)
	{
		const value = parseFloat(amount.amount)
		if(!Number.isNaN(value)) return new ObservableAssetBalance({chain, denom: amount.denom, balance: value})
		return undefined
	}
}