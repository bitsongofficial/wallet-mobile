import { SupportedFiats } from "core/utils/Coin";

export type IWallet = {
  address: string;
  name: string;
  type: "one" | "two";
};

export type ILang = {
  name: string;
  value: string;
  id: string;
};

export type ICurrency = {
  _id: string;
  name: SupportedFiats;
  title: string;
  symbol: string;
};
