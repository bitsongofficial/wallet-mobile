import Coin from "classes/Coin";
import { IPerson, ITransaction } from "classes/types";
import { makeAutoObservable } from "mobx";
import { InputHandler } from "utils";

export default class TransactionCreater {
  coin: Coin | null = null;
  amount: string = ""; // usd
  receiver?: IPerson | null = null; //

  addressInput = new InputHandler();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setCoin(coin: Coin) {
    this.coin = coin;
  }
  setAmount(amount: string) {
    this.amount = amount;
  }
  setReceiver(receiver: IPerson) {
    this.receiver = receiver;
  }

  setMax() {
    if (this.coin?.balanceUSD) {
      this.amount = this.coin.balanceUSD.toString();
    }
  }

  get address() {
    return this.addressInput.value;
  }

  get isAddressValid() {
    // TODO: upd. this
    return !!this.address;
  }

  get isReady() {
    return !!this.coin && !!this.amount && this.isAddressValid && this.receiver;
  }

  create(): ITransaction | undefined {
    if (!!this.coin && !!this.amount && this.isAddressValid && this.receiver) {
      const { address, amount, coin, receiver } = this;
      return {
        address,
        amount,
        coin: coin.info,
        receiver,
      };
    }
  }
}
