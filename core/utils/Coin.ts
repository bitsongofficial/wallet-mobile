import { SupportedCoins, SupportedCoinsMap } from "constants/Coins"
import { ChainIds, ChainRegistryNames, CoinClasses } from "core/types/coin/Dictionaries"
import { Amount, Denom } from "core/types/coin/Generic"
import { assets, chains, ibc } from 'chain-registry'
import { Asset } from '@chain-registry/types'
import { getIbcAssets } from "@chain-registry/utils"
import { Prices } from "core/types/rest/coingecko"
import { Wallet } from "core/types/storing/Generic"

const ibcPrefix = "ibc/"

export enum SupportedFiats {
	USD = "usd",
	EUR = "eur",
}

export const ibcMap: {
	[k: string]: string
} = {}

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

export function fromDenomToPrice(denom: Denom | string, prices: Prices): number
{
	const chain = fromDenomToCoin(denom)
	if(chain) return prices[chain] ?? 0
	return 0
}

export function fromAmountToFIAT(amount: Amount, prices: Prices)
{
	return fromAmountToCoin(amount) * fromDenomToPrice(amount.denom, prices)
}

export function fromFIATToAmount(fiat: number, denom: Denom, prices: Prices): Amount
{
	const price = fromDenomToPrice(denom, prices)
	return {
		amount: Math.round(fiat / (price ? price : 1) * convertRateFromDenom(denom)).toString(),
		denom,
	}
}

export function fromCoinToDefaultDenom(coin: SupportedCoins): Denom
{
	return CoinClasses[coin].denom()
}

export function fromDenomToCoin(denom: Denom | string): SupportedCoins | undefined
{
	const resolvedDenom = resolveAsset(denom)
	for(const chain of Object.values(SupportedCoins))
	{
		const chainAssets = assets.find(a => a.chain_name == ChainRegistryNames[chain])?.assets
		if(chainAssets && chainAssets.find(ca => ca.base == resolvedDenom)) return chain
	}

	return undefined
}

export function resolveAsset(asset: string | SupportedCoins)
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

export function getAssetsInfos(asset: string | SupportedCoins)
{
	asset = resolveAsset(asset)
	return assets.reduce((res: Asset[], a) => res.concat(a.assets), []).find((a)=>(a.base===asset))
}

export function getAssetName(asset: string | SupportedCoins)
{
	const infos = getAssetsInfos(asset)
	return infos ? infos.name.replace("Fantoken", "") : "undefined"
}

export function getAssetSymbol(asset: string | SupportedCoins)
{
	const infos = getAssetsInfos(asset)
	return infos ? infos.symbol : ""
}

export function getAssetTag(asset: string | SupportedCoins)
{
	const infos = getAssetsInfos(asset)
	return infos ? infos.display.toUpperCase() : "Undefined"
}

export function getAssetIcon(asset: string | SupportedCoins)
{
	const infos = getAssetsInfos(asset)
	return infos && infos.logo_URIs && infos.logo_URIs.png ? infos.logo_URIs.png : undefined
}

export function getAssetDenomUnits(asset: string | SupportedCoins)
{
	const infos = getAssetsInfos(asset)
	return infos ? infos.denom_units : undefined
}

export function getDenomExponent(denom: string | Denom | SupportedCoins)
{
	return getAssetDenomUnits(denom)?.find(du => du.denom == denom)?.exponent
}

export function firstAvailableWallet(wallets: SupportedCoinsMap<Wallet>)
{
	const walletItems = Object.values(wallets)
	if(walletItems.length > 0) return walletItems[0]
	return undefined
}