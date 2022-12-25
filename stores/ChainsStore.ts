import { SupportedCoins } from "constants/Coins"
import { AlternativeChain } from "core/coin/cosmos/AlternativeChain"
import { CosmosCoin } from "core/coin/cosmos/CosmosCoin"
import { CoinClasses } from "core/types/coin/Dictionaries"
import { fromObjectToMap } from "core/utils/Maps"
import { makeAutoObservable, runInAction } from "mobx"
import { mergeMaps } from "../core/utils/Maps"
import { Chain, CodedCosmosChain } from "./models/Chain"
import { DynamicCosmosChain } from "./proxies/DynamicCosmosChain"
import RemoteConfigsStore from "./RemoteConfigsStore"
import SettingsStore from "./SettingsStore"

type AlternateChainOptions = {
	name: string,
	rpc: string,
	lcd: string,
}
export default class ChainsStore {
	private customChains = new Map<string, Chain> ()
	constructor(private settingsStore: SettingsStore, private remoteStore: RemoteConfigsStore) {
		makeAutoObservable(this, {}, { autoBind: true })
		runInAction(() =>
		{
			Object.entries(CoinClasses).forEach(([key, coin]) =>
			{
				this.customChains.set(key, new CodedCosmosChain(coin))
			})
		})
	}

	get Chains()
	{
		const coins = fromObjectToMap<Chain>(CoinClasses)
		return mergeMaps<string, Chain>(coins, this.customChains)
	}

	addAliasChain(name: string, alias: string)
	{
		const aliasChain = this.Chains.get(alias)
		if(aliasChain) this.customChains.set(name, aliasChain)
	}

	addAlternateChain(original: string, alternateChain: AlternateChainOptions)
	{
		const baseChain = this.Chains.get(original)
		if(baseChain)
		{
			const chainBaseClass = (baseChain as CodedCosmosChain).chain
			this.customChains.set(alternateChain.name, new CodedCosmosChain(new AlternativeChain(chainBaseClass, alternateChain.rpc, alternateChain.lcd)))
		}
	}

	get enabledCoins()
	{
		const testnet = this.settingsStore.testnet
		return this.remoteStore.enabledCoins.filter(ec =>
			{
				if(testnet)
				{
					return ec.indexOf("testnet") > -1
				}
				else
				{
					return ec.indexOf("testnet") < 0
				}
			})
	}

	ResolveChain(chainIndex: string)
	{
		const chains = this.Chains
		if(chains.has(chainIndex)) return chains.get(chainIndex)

		return [...chains.values()].find(c => (c.id == chainIndex || c.name == chainIndex))
	}

	ChainKey(chainIndex: string)
	{
		const searchValue = this.ResolveChain(chainIndex)
		const chains = this.Chains
		for (let [key, value] of chains.entries())
		{
			if (value === searchValue)
				return key
		}
	}

	ChainId(chainIndex: string)
	{
		return this.ResolveChain(chainIndex)?.id
	}

	ChainName(chainIndex: string)
	{
		return this.ResolveChain(chainIndex)?.name
	}

	ChainLogo(chainIndex: string)
	{
		return this.ResolveChain(chainIndex)?.logo
	}

	ChainPrefix(chainIndex: string)
	{
		return this.ResolveChain(chainIndex)?.prefix
	}

	ChainDefaultDenom(chainIndex: string)
	{
		return this.ResolveChain(chainIndex)?.defaultDenom
	}

	ChainOperator(chainIndex: string)
	{
		const chain = this.ResolveChain(chainIndex)
		return (chain !== undefined ? new DynamicCosmosChain(chain) : undefined)
	}

	ChainRPC(chainIndex: string)
	{
		return this.ResolveChain(chainIndex)?.rpc
	}

	ChainAsSupportedOne(chainIndex: string)
	{
		return (this.ResolveChain(chainIndex) as CodedCosmosChain).chain.chain() as SupportedCoins
	}
}