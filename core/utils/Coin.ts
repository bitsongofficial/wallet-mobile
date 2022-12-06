import { SupportedCoins, SupportedCoinsMap } from "constants/Coins"
import { ChainIds, ChainRegistryNames, CoinClasses } from "core/types/coin/Dictionaries"
import { Amount, Denom } from "core/types/coin/Generic"
import { assets, chains, ibc } from 'chain-registry'
import { Asset } from '@chain-registry/types'
import { getIbcAssets } from "@chain-registry/utils"
import { Wallet } from "core/types/storing/Generic"
import { AssetIndex } from "core/types/coin/Assets"

const ibcPrefix = "ibc/"

export enum SupportedFiats {
	USD = "usd",
	EUR = "eur",
}

export const ibcMap: {
	[k: string]: string
} = {}

const assetsOnly = assets.reduce((res: Asset[], a) => res.concat(a.assets), [])

Object.values(SupportedCoins).forEach(sc =>
	{
		const ibcChainAssets = getIbcAssets(ChainRegistryNames[sc], ibc, assets)
		ibcChainAssets.forEach(ibcca =>
			ibcca.assets.forEach((ibcAsset: any) =>
			{
				const base = ibcAsset.base
				const denomReference = ibcAsset.denom_units.find((ibca:any) => ibca.denom == base)
				if(denomReference)
				{
					const denom = denomReference.aliases[0]
					ibcMap[base] = denom
				}
			})
		)
	})
const getInnerValueForIbc = (key: string): string =>
{
	const value = ibcMap[key]
	if(value && value.startsWith(ibcPrefix)) return getInnerValueForIbc(value)
	return value
}
for (const [key, value] of Object.entries(ibcMap))
{
	if(value && value.startsWith(ibcPrefix)) ibcMap[key] = getInnerValueForIbc(key)
}

export function convertRateFromDenom(denom: Denom | string)
{
	const resolvedDenom = resolveAsset(denom)
	switch(resolvedDenom)
	{
		default:
			const denomFromChainRegistry = getDenomExponent(resolvedDenom)
			return denomFromChainRegistry !== undefined ? Math.pow(10, 6 - denomFromChainRegistry) : 0
	}
}

export function fromAmountToCoin(amount: Amount)
{
	const cr = convertRateFromDenom(amount.denom)
	return Number(amount.amount) / (cr ? cr : 1)
}

export function fromCoinToAmount(balance: number, coin: SupportedCoins | Denom | string)
{
	let denom
	if(coin in SupportedCoins)
	{
		denom = CoinClasses[coin as SupportedCoins].denom()
	}
	else
	{
		denom = coin
	}
	return {
		amount: (balance * convertRateFromDenom(denom)).toString(),
		denom,
	}
}

export function fromCoinToDefaultDenom(coin: SupportedCoins): Denom
{
	return CoinClasses[coin].denom()
}

export function fromDenomToChainName(denom: AssetIndex): string | undefined
{
	assets.forEach(a =>
		{
			if(a.assets.find(ca => ca.denom_units.find(du => du.denom == denom) != undefined) != undefined) return a.chain_name
		})

	return undefined
}

export function chainNameToChainId(chainName: string)
{
	return chains.find(c => c.chain_name == chainName)?.chain_id
}

export function resolveAsset(asset: AssetIndex)
{
	const chain = asset as SupportedCoins
	if(asset && Object.values(SupportedCoins).includes(chain)) return fromCoinToDefaultDenom(chain)
	if(asset.startsWith(ibcPrefix)) return ibcMap[asset]
	return asset
}

function resolveCoin(coin: SupportedCoins)
{
	return chains.find((c: any) =>
	{
		return c.chain_name == ChainRegistryNames[coin]
	})
}

export function chainIdToChain(chainId: string)
{
	const entry = Object.entries(ChainIds).find(ci => ci[1] == chainId)
	if(entry) return entry[0] as SupportedCoins
	return undefined
}

export function getCoinGasUnit(coin: SupportedCoins)
{
	const c = resolveCoin(coin)
	if(c && c.fees && c.fees.fee_tokens && c.fees.fee_tokens.length > 0)
	{
		const token = c.fees.fee_tokens[0]
		return token.fixed_min_gas_price + token.denom
	}

	return undefined
}

export function getCoinPrefix(coin: SupportedCoins)
{
	return resolveCoin(coin)?.bech32_prefix
}

export function getCoinName(coin: SupportedCoins)
{
	return resolveCoin(coin)?.pretty_name
}

export function getCoinIcon(coin: SupportedCoins)
{
	return getAssetIcon(coin)
}

export function fromPrefixToCoin(prefix: string)
{
	const chain = chains.find((c: any) => c.bech32_prefix == prefix)
	const a = Object.entries(ChainRegistryNames).find(e => e[1] == chain?.chain_name)?.[0] as SupportedCoins
	return a
}

export function getCoinDerivationPath(coin: SupportedCoins)
{
	const c = resolveCoin(coin)
	return ""
}

export function getAssetsInfos(asset: AssetIndex)
{
	asset = resolveAsset(asset)
	return assetsOnly.find((a)=>(a.denom_units.find(du => du.denom===asset) != undefined))
}

export function doesChainRegistryAssetExists(asset: AssetIndex)
{
	return getAssetsInfos(asset) != undefined
}

export function getAssetName(asset: AssetIndex)
{
	const infos = getAssetsInfos(asset)
	return infos ? infos.name.replace("Fantoken", "") : "undefined"
}

export function getAssetSymbol(asset: AssetIndex)
{
	const infos = getAssetsInfos(asset)
	return infos ? infos.symbol : ""
}

export function getAssetTag(asset: AssetIndex)
{
	const infos = getAssetsInfos(asset)
	return infos ? infos.display.toUpperCase() : "Undefined"
}

export function getAssetIcon(asset: AssetIndex)
{
	const infos = getAssetsInfos(asset)
	return infos && infos.logo_URIs && infos.logo_URIs.png ? infos.logo_URIs.png : undefined
}

export function getAssetCoingeckoId(asset: AssetIndex)
{
	const infos = getAssetsInfos(asset)
	return infos?.coingecko_id
}

export function getAssetDenomUnits(asset: AssetIndex)
{
	const infos = getAssetsInfos(asset)
	return infos ? infos.denom_units : undefined
}

export function getDenomExponent(denom: AssetIndex)
{
	return getAssetDenomUnits(denom)?.find(du => du.denom == denom)?.exponent
}

export function getBaseDenom(denom: AssetIndex)
{
	const infos = getAssetsInfos(denom)
	if(infos)
	{
		return infos.denom_units.find(du => du.exponent == 6)		
	}
	return undefined
}

export function getDenomsExponentDifference(denom1: AssetIndex, denom2: AssetIndex)
{
	const exp1 = getDenomExponent(denom1)
	const exp2 = getDenomExponent(denom2)
	return (exp1 && exp2) ? (exp2 - exp1) : undefined
}

export function getBaseDenomName(denom: AssetIndex)
{
	return getBaseDenom(denom)?.denom
}

export function firstAvailableWallet(wallets: SupportedCoinsMap<Wallet>)
{
	const walletItems = Object.values(wallets)
	if(walletItems.length > 0) return walletItems[0]
	return undefined
}