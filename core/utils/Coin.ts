import { SupportedCoins } from "constants/Coins"
import { CoinClasses } from "core/types/coin/Dictionaries"
import { Amount, Denom } from "core/types/coin/Generic"

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