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
  name: string;
  title: string;
};
