import { SupportedCoins } from "constants/Coins"

export interface ICoin {
	_id: string
	logo: any
	balance: number
	brand: string
	coinName: string
	address: string
	coin: SupportedCoins
	denom: string
}

export interface IChainCoinData {
	coin: SupportedCoins.BITSONG
	balance: number
}
export interface IRemoteCoinData {
	coin: SupportedCoins
	brand: string
	coinName: string
	logo: string
	price: 1234 // $
}

export type IPerson = {
	_id: string
	avatar: any
	firstName: string
	lastName: string
	nickname: string
	address: string
}

// WIP
export type ITransaction = {
	coin: ICoin
	balance: number
	address: string
	receiver: IPerson
}
