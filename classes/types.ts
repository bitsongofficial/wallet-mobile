import { SupportedCoins } from "constants/Coins";

export interface ICoin {
	_id: string;
	logo: any;
	balance: number;
	brand: string;
	coinName: string;
	address: string;
	coin: SupportedCoins;
	denom: string;
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
