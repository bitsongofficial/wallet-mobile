import { SupportedCoins } from "constants/Coins"
import { getCoinGeckoPrices } from "core/rest/coingecko"
import { AssetIndex } from "core/types/coin/Assets"
import { CoinClasses } from "core/types/coin/Dictionaries"
import { CoingeckoPrice } from "core/types/rest/coingecko"
import { chainIdToChain, getAssetDenomUnits, getDenomsExponentDifference, resolveAsset } from "core/utils/Coin"
import { mergeMaps } from "core/utils/Maps"
import { autorun, get, makeAutoObservable, runInAction, set, toJS } from "mobx"
import ChainsStore from "./ChainsStore"
import { Asset, ChainRegistryAsset } from "./models/Asset"
import SettingsStore from "./SettingsStore"

export default class AssetsStore {
	private customAssets = new Map<AssetIndex, Asset> ()
	private prices = new Map<AssetIndex, CoingeckoPrice>()
	private baseAssets = new Map<AssetIndex, Asset>()
	constructor(private chainsStore: ChainsStore, private settingsStore: SettingsStore)
	{
		const baseDenoms = Object.values(CoinClasses).map(c => c.denom())
		baseDenoms.forEach(denom => (this.baseAssets.set(denom, new ChainRegistryAsset(denom))))
		makeAutoObservable(this, {}, { autoBind: true })

		autorun(async () =>
		{
			const assets = this.Assets
			const coinGeckoAssets = [...assets.values()].filter(a => a.coingeckoId != undefined).map(a => a.coingeckoId as string)
			const prices = await getCoinGeckoPrices(coinGeckoAssets)
			runInAction(() =>
			{
				for(const prop in prices)
				{
					set(this.prices, prop, prices[prop])
				}
			})
		})
	}

	get Prices() {
		return this.prices
	}

	get Assets() {
		const customAssets = this.customAssets
		return mergeMaps<AssetIndex, Asset>(this.baseAssets, customAssets)
	}

	ResolveAsset(asset: AssetIndex)
	{
		const resolvedAsset = resolveAsset(asset)
		if(this.Assets.has(resolvedAsset)) return this.Assets.get(resolvedAsset)
		else return new ChainRegistryAsset(asset)
	}

	AssetChainId(asset: AssetIndex)
	{
		return this.ResolveAsset(asset)?.chainId
	}

	AssetChain(asset: AssetIndex)
	{
		const assetChain = this.AssetChainId(asset)
		if(assetChain === undefined) return
		const chainId = this.chainsStore.ChainId(assetChain)
		if(chainId === undefined) return
		return chainIdToChain(chainId)
	}

	AssetPrice(asset: AssetIndex)
	{
		const assetItem = this.ResolveAsset(asset)
		let coingeckoId = undefined
		let existingDenom = undefined
		let exponentsDifference = 0
		if(assetItem && assetItem.coingeckoId) coingeckoId = assetItem.coingeckoId
		else
		{
			const denoms = getAssetDenomUnits(asset)
			existingDenom = denoms?.find(d => this.Assets.has(d.denom))
			if(existingDenom)
			{
				exponentsDifference = getDenomsExponentDifference(asset, existingDenom.denom) ?? 0
				coingeckoId = this.ResolveAsset(existingDenom.denom)?.coingeckoId
			}
		}
		if(coingeckoId == undefined) return undefined
		
		const assetPrices = this.Prices.get(coingeckoId)
		if(assetPrices == undefined) return undefined

		const price = get(assetPrices, this.settingsStore.currency)
		if(price && exponentsDifference !== undefined) return Math.pow(10, -exponentsDifference) * price

		return undefined
	}

	IsBitsongMainAsset(asset: AssetIndex)
	{
		const chain = this.AssetChain(asset)
		return (chain != undefined && (chain === SupportedCoins.BITSONG || chain === SupportedCoins.BITSONG_TESTNET))
	}
}