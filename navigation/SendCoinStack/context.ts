import { createContext, useMemo, useState } from "react";
import { Coin } from "classes";
import { IPerson } from "screens/SendModalScreens/components";
import { useStore } from "hooks";

export type ContextValue = {
  coin?: Coin;
  setCoin(coin: Coin): void;

  amount: number; // usd
  setAmount(amount: number): void;

  address: string;
  setAddress(address: string): void;

  receiver?: IPerson;
  setReceiver(receiver: IPerson): void;

  onSend(): void;
  parentNav: any;
};

export const SendCoinContext = createContext<ContextValue>();

export function useSendCoinContextValue(
  onSend: ContextValue["onSend"],
  parentNav: ContextValue["parentNav"]
) {
  const { wallet } = useStore();

  const [coin, setCoin] = useState(wallet.coins[0]);
  const [receiver, setReceiver] = useState<IPerson>();
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState("");

  return useMemo<ContextValue>(
    () => ({
      coin,
      setCoin,
      amount,
      setAmount,
      receiver,
      setReceiver,
      address,
      setAddress,
      onSend,
      parentNav,
    }),
    [coin, receiver, amount, address, onSend, parentNav]
  );
}
