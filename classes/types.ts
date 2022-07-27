import { SupportedCoins } from "constants/Coins";

export interface ICoin {
	_id: string;
	logo: any;
	balance: number;
	brand: string;
	coinName: string;
	address: string;
	coin: SupportedCoins;
}

export type IValidator = {
	name: string
	claim: number
	apr: number
	voting_power: number
	total: number
	address_operation: string
	address_account: string
	uptime: number
	maxConvertionRate: number
	currentCommissionRate: number
	lastCommissionChange: string // date
}

export type IPerson = {
  _id: string;
  avatar: any;
  firstName: string;
  lastName: string;
  nickname: string;
  address: string;
};

// WIP
export type ITransaction = {
  coin: ICoin;
  balance: number;
  address: string;
  receiver: IPerson;
};
