export interface ICoin {
  _id: string;
  logo: any;
  balance: number;
  brand: string;
  coinName: string;
  address: string;
}

export type IPerson = {
  _id: string;
  avatar: any;
  firstName: string;
  lastName: string;
};

// WIP
export type ITransaction = {
  coin: ICoin;
  amount: number;
  address: string;
  receiver: IPerson;
};
