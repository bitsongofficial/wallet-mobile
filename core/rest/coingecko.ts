import axios from 'axios'
import { SupportedCoins } from 'constants/Coins';
import { CoingeckoPrice, CoingeckoPrices } from 'core/types/rest/coingecko';
import { SupportedFiats } from 'core/utils/Coin';
import Config from "react-native-config"

export const coinGeckoApi = axios.create({
	withCredentials: false,
	headers: {
		'Content-Type': 'application/json',
	},
	responseType: 'json',
	baseURL: Config.COINGGECKO_URL
})

const coinIds: {
	[k in SupportedCoins]: string
} = {
	[SupportedCoins.BITSONG]: "bitsong",
	[SupportedCoins.BITSONG118]: "bitsong",
	[SupportedCoins.OSMOSIS]: "osmosis",
}

function coingeckoCoinName(coin: SupportedCoins)
{
	return coinIds[coin]
}

export async function getCoinGeckoPrices(coins: SupportedCoins[])
{
	let currencies = ""
	let c: keyof typeof SupportedFiats
	for(c in SupportedFiats)
	{
		currencies += SupportedFiats[c] + ","
	}
	currencies = currencies.slice(0, currencies.length-1)
	let data:CoingeckoPrices | undefined = undefined
	try
	{
		data = (await coinGeckoApi.get<CoingeckoPrices>(`simple/price`, {
			params: {
				ids: coins.map(coin => coingeckoCoinName(coin)).filter((item, index, arr) => index == arr.indexOf(item)).join(","),
				vs_currencies: currencies,
			}
		})).data
	}
	catch(e)
	{
		console.error("Catched", e)
	}
	const formattedData: {
		[k in SupportedCoins]?: CoingeckoPrice
	} = {}
	coins.forEach(c =>
	{
		for(const k in data)
		{
			if(coingeckoCoinName(c) == k) formattedData[c] = data[k]
		}
	})
	return formattedData
}