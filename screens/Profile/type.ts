import { SupportedFiats } from "core/utils/Coin";

export type IWallet = {
  address: string;
  name: string;
  type: "one" | "two";
};

export type ILang = {
  name: string;
  value: string;
};

export type ICurrency = {
  title: string;
  symbol: string;
};
