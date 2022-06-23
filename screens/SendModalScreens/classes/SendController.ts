import { Coin, Steps } from "classes";
import Transaction from "classes/Transaction";
import TransactionCreater from "classes/Transaction/Creater";
import { makeAutoObservable } from "mobx";

export default class SendController {
  steps = new Steps([
    "Insert Import",
    "Select Receiver",
    "Send Recap",
    "Select coin",
  ]);

  creater = new Transaction.Creater();

  constructor(coin: Coin, creater?: TransactionCreater) {
    if(creater) this.creater = creater
    this.creater.setCoin(coin);
    makeAutoObservable(this, {}, { autoBind: true });
  }

  addAmountNumber(num: string) {
    const { coin, amount } = this.creater;
    const isDotIsOnce = (num === "." && !amount.includes(num)) || num !== ".";

    if (isDotIsOnce) {
      const nextAmount = amount + num;
      const balance = coin?.balanceUSD;

      !balance || balance > Number(nextAmount)
        ? this.creater.setAmount(nextAmount)
        : this.creater.setMax();
    }
  }

  removeAmountNumber() {
    this.creater.setAmount(this.creater.amount.slice(0, -1));
  }
}
