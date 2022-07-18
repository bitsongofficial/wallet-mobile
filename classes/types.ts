import { SupportedCoins } from "constants/Coins";

export interface ICoin {
export type IValidator = {
	_id: string // address
	name: string
	logo: string
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
  amount: string;
  address: string;
  receiver: IPerson;
};
