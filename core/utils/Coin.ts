import { Amount, Denom } from "core/types/coin/Generic"

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
			return prices.bitsong
	}
}

export function fromAmountToDollars(amount: Amount, prices:any)
{
	return fromAmountToCoin(amount) * fromDenomToPrice(amount.denom, prices)
}

export function fromDollarsToAmount(dollars: number, denom: Denom, prices:any): Amount
{
	return {
		amount: Math.round(dollars / fromDenomToPrice(denom, prices) * convertRateFromDenom(denom)).toString(),
		denom,
	}
}