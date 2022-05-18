import Coin from "classes/Coin";
import { IPerson, ITransaction } from "classes/types";
import { makeAutoObservable } from "mobx";
import { InputHandler } from "utils";
// import { ITransaction } from "";

export default class TransactionCreater {
  coin: Coin | null = null;
  amount: string = ""; // usd
  address: string | null = null;
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
  setAddress(address: string) {
    this.address = address;
  }
  setReceiver(receiver: IPerson) {
    this.receiver = receiver;
  }

  get isAddressValid() {
    // TODO: upd. this
    return !!this.address;
  }

  get isReady() {
    return !!this.coin && !!this.amount && this.isAddressValid && this.receiver;
  }

  create(): ITransaction {
    if (this.isReady) {
      const { address, amount, coin, receiver } = this;
      return { address, amount, coin, receiver };
    }
  }
}
