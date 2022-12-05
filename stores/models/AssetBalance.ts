import { AssetIndex } from "core/types/coin/Assets";
import { Amount } from "core/types/coin/Generic";
import { makeAutoObservable } from "mobx";

export interface AssetBalance {
	denom: AssetIndex,
	balance: number,
}

export class ObservableAssetBalance implements AssetBalance {
	denom: AssetIndex
	balance: number
	constructor(balance: AssetBalance)
	{
		this.denom = balance.denom
		this.balance = balance.balance
		makeAutoObservable(this)
	}

	static fromAmount(amount: Amount)
	{
		const value = parseFloat(amount.amount)
		if(value != NaN) return new ObservableAssetBalance({denom: amount.denom, balance: value})
		return undefined
	}
}