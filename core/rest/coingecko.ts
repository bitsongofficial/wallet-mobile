import axios from 'axios'
import { SupportedCoins } from 'constants/Coins';
import { CoingeckoPrice, CoingeckoPrices } from 'core/types/rest/coingecko';
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
	[SupportedCoins.BITSONG]: "bitsong"
}

function coingeckoCoinName(coin: SupportedCoins)
{
	return coinIds[coin]
}

function fromCoingeckoNameToCoin(name: string): SupportedCoins
{
	for(const [key, value] of Object.entries(coinIds))
	{
		if(value == name) return key as SupportedCoins
	}
	return SupportedCoins.BITSONG
}

export async function getCoinGeckoPrices(coins: SupportedCoins[])
{
	const data = (await coinGeckoApi.get<CoingeckoPrices>(`simple/price`, {
		params: {
			ids: coins.map(coin => coingeckoCoinName(coin)).join(","),
			vs_currencies:"usd",
		}
	})).data
	const formattedData: {
		[k in SupportedCoins]?: CoingeckoPrice
	} = {}
	for(const k in data)
	{
		formattedData[fromCoingeckoNameToCoin(k)] = data[k]
	}
	return formattedData
}