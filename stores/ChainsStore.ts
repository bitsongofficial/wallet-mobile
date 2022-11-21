import { AlternativeChain } from "core/coin/cosmos/AlternativeChain"
import { CosmosCoin } from "core/coin/cosmos/CosmosCoin"
import { CoinClasses } from "core/types/coin/Dictionaries"
import { fromObjectToMap } from "core/utils/Maps"
import { makeAutoObservable, runInAction } from "mobx"
import { mergeMaps } from "../core/utils/Maps"

type AlternateChainOptions = {
	name: string,
	rpc: string,
	lcd: string,
}
export default class ChainsStore {
	private customChains = new Map<string, CosmosCoin> ()
	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
		runInAction(() =>
		{
			Object.entries(CoinClasses).forEach(([key, coin]) =>
			{
				this.customChains.set(key, coin)
			})
		})
	}

	get chains()
	{
		const coins = fromObjectToMap<CosmosCoin>(CoinClasses)
		return mergeMaps<string, CosmosCoin>(coins, this.customChains)
	}

	addAliasChain(name: string, alias: string)
	{
		const aliasChain = this.chains.get(alias)
		if(aliasChain) this.customChains.set(name, aliasChain)
	}

	addAlternateChain(original: string, alternateChain: AlternateChainOptions)
	{
		const baseChain = this.chains.get(original)
		if(baseChain)
		{
			this.customChains.set(alternateChain.name, new AlternativeChain(baseChain, alternateChain.rpc, alternateChain.lcd))
		}
	}
}