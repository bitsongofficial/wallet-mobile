import { createContext } from "react";
import { Coin } from "classes";

export type ContextValue = {
  coin?: Coin;
  setCoin(coin: Coin): void;

  receiver: string;
  setReceiver(receiver: string): void;

  onSend(): void;
};

export const SendCoinContext = createContext<ContextValue>();
