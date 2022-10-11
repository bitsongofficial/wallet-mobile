import { SupportedCoins } from "constants/Coins"
import { ChainRegistryNames, CoinClasses } from "core/types/coin/Dictionaries"
import { Amount, Denom } from "core/types/coin/Generic"
import { assets, chains } from 'chain-registry'

export enum SupportedFiats {
	USD = "usd",
	EUR = "eur",
}

export function convertRateFromDenom(denom: Denom)
{
	switch(denom)
	{
		case Denom.UBTSG:
			return 1000000
		default:
			return 0
	}
}

export function fromAmountToCoin(amount: Amount)
{
	const cr = convertRateFromDenom(amount.denom)
	return Number(amount.amount) / (cr ? cr : 1)
}

export function fromCoinToAmount(balance: number, coin: SupportedCoins)
{
	const denom = CoinClasses[coin].denom()
	return {
		amount: (balance * convertRateFromDenom(denom)).toString(),
		denom,
	}
}

export function fromDenomToPrice(denom: Denom, prices:any): number
{
	switch(denom)
	{
		case Denom.UBTSG:
		case Denom.BTSGN:
			return prices.btsg
		default:
			return 0
	}
}

export function fromAmountToFIAT(amount: Amount, prices:any)
{
	return fromAmountToCoin(amount) * fromDenomToPrice(amount.denom, prices)
}

export function fromFIATToAmount(fiat: number, denom: Denom, prices:any): Amount
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

export function fromDenomToCoin(denom: Denom): SupportedCoins | undefined
{
	for(const chain of Object.values(SupportedCoins))
	{
		if(CoinClasses[chain].denom() == denom) return chain
	}

	return undefined
}

function resolveAsset(asset: string | SupportedCoins)
{
	const chain = asset as SupportedCoins
	if(asset && Object.values(SupportedCoins).includes(chain)) return fromCoinToDefaultDenom(chain)
	return asset
}

function resolveCoin(coin: SupportedCoins)
{
	return chains.find((c: any) =>
	{
		return c.chain_name == ChainRegistryNames[coin]
	})
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
	return resolveCoin(coin).bech32_prefix
}

export function getCoinName(coin: SupportedCoins)
{
	return resolveCoin(coin).pretty_name
}

export function getCoinIcon(coin: SupportedCoins)
{
	return getAssetIcon(coin)
}

export function fromPrefixToCoin(prefix: string)
{
	const chain = chains.find((c: any) => c.bech32_prefix == prefix)
	const a = Object.entries(ChainRegistryNames).find(e => e[1] == chain.chain_name)?.[0] as SupportedCoins
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
	return assets.reduce((res: any[], a:any) => res.concat(a.assets), []).find((a: any)=>(a.base===asset))
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