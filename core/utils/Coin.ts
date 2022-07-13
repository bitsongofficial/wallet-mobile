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
		default:
			return 1000000
	}
}

export function fromAmountToCoin(amount: Amount)
{
	return Number(amount.amount) / convertRateFromDenom(amount.denom)
}

export function fromDenomToPrice(denom: Denom, prices:any): number
{
	switch(denom)
	{
		default:
			return prices.btsg
	}
}

export function fromAmountToFIAT(amount: Amount, prices:any)
{
	return fromAmountToCoin(amount) * fromDenomToPrice(amount.denom, prices)
}

export function fromFIATToAmount(fiat: number, denom: Denom, prices:any): Amount
{
	return {
		amount: Math.round(fiat / fromDenomToPrice(denom, prices) * convertRateFromDenom(denom)).toString(),
		denom,
	}
}

export function fromCoinToDefaultDenom(coin: SupportedCoins): Denom
{
	return CoinClasses[coin].coin.denom()
}