import { SupportedCoins } from "constants/Coins";
import { Asset } from "stores/models/Asset";

export interface ICoinMultiChain {
	_id: string;
	logo: any;
	balance: number;
	brand: string;
	coinName: string;
	address: string;
	denom: string;
}

export interface ICoin extends ICoinMultiChain {
	coin: SupportedCoins;
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
  asset: Asset;
  balance: number;
  address: string;
  receiver: IPerson;
}