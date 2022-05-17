import { Coin, Steps } from "classes";
import Transaction from "classes/Transaction";
import { makeAutoObservable } from "mobx";

export default class SendController {
  steps = new Steps([
    "Insert Import",
    "Select Receiver",
    "Select coin",
    "Send Recap",
  ]);

  creater = new Transaction.Creater();

  constructor(coin: Coin) {
    this.creater.setCoin(coin);
    makeAutoObservable(this, {}, { autoBind: true });
  }

  addAmountNumber(num: string) {
    const amount = this.creater.amount + num;
    if (amount) this.creater.setAmount(amount);
  }

  removeAmountNumber() {
    const amount = this.creater.amount.slice(0, -1);
    if (amount) this.creater.setAmount(amount);
  }
}
