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

export type IPerson = {
  _id: string;
  avatar: any;
  firstName: string;
  lastName: string;
  address: string; // TODO: may be alternative for _id
};

// WIP
export type ITransaction = {
  coin: ICoin;
  amount: string;
  address: string;
  receiver: IPerson;
};
