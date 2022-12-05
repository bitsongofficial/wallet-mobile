import { AssetIndex } from "core/types/coin/Assets"
import { chainNameToChainId, fromDenomToChainName, getAssetCoingeckoId, getAssetIcon, getAssetName, getAssetTag, getDenomExponent, resolveAsset } from "core/utils/Coin"

export interface Asset {
	name: string,
	tag: string,
	icon: string | undefined,
	chainId: string,
	denom: string,
	coingeckoId: string | undefined,
	exponent?: number,
}

export class ChainRegistryAsset implements Asset {
	name: string
	tag: string
	icon: string | undefined
	chainId: string
	denom: string
	coingeckoId: string | undefined
	exponent?: number

	constructor(asset: AssetIndex)
	{
		this.name = getAssetName(asset)
		this.tag = getAssetTag(asset)
		this.icon = getAssetIcon(asset)
		this.coingeckoId = getAssetCoingeckoId(asset)
		this.denom = resolveAsset(asset)
		this.chainId = chainNameToChainId(fromDenomToChainName(asset) ?? "") ?? ""
		this.exponent = getDenomExponent(asset)
	}
}