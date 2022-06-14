import axios from 'axios'
import { SupportedCoins } from 'constants/Coins';
import { CoingeckoPrice } from 'core/types/rest/coingecko';
import Config from "react-native-config"

export const coinGeckoApi = axios.create({
	withCredentials: false,
	headers: {
		'Content-Type': 'application/json',
	},
	responseType: 'json',
	baseURL: Config.COINGGECKO_URL
})

function coingeckoCoinName(coin: SupportedCoins)
{
	switch(coin)
	{
		default:
			return "bitsong"
	}
}

export async function getCoinGeckoPrice(coin: SupportedCoins)
{
	return (await coinGeckoApi.get<CoingeckoPrice>(`simple/price`, {
		params: {
			ids: coingeckoCoinName(coin),
			vs_currencies:"usd",
		}
	})).data
}