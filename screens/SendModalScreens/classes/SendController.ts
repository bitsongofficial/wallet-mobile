import { Coin, Steps } from "classes";
import Transaction from "classes/Transaction";
import TransactionCreater from "classes/Transaction/Creater";
import { makeAutoObservable } from "mobx";
import { round } from "utils";

export default class SendController {
  steps = new Steps([
    "Insert Import",
    "Select Receiver",
    "Send Recap",
    "Select coin",
  ]);

  creater = new Transaction.Creater();
  balance = ""

  constructor(coin: Coin, creater?: TransactionCreater) {
    if(creater) this.creater = creater
    this.creater.setCoin(coin);
    makeAutoObservable(this, {}, { autoBind: true });
  }

  fromAmountToBalance(amount: string)
  {
    let v
    if (this.creater.coin?.rate) {
      const value = Coin.culcTokenBalance(
        parseFloat(amount),
        this.creater.coin.rate
      );
      if (value) {
        v = round(value);
      }
      else
      {
        v = 0
      }
    }
    else
    {
      v = 0
    }
    return v.toString()
  }

  fromBalanceToAmount(balance: string)
  {
    let v
    if (this.creater.coin?.rate) {
      const value = Coin.culcFiatBalance(
        parseFloat(balance),
        this.creater.coin.rate
      );
      if (value) {
        v = round(value);
      }
      else
      {
        v = 0
      }
    }
    else
    {
      v = 0
    }
    return v.toString()
  }

  updateAmountFromBalance()
  {
    this.creater.setAmount(this.fromBalanceToAmount(this.balance))
  }

  updateBalanceFromAmount()
  {
    if (this.creater.coin?.rate) {
      const value = Coin.culcTokenBalance(
        parseFloat(this.creater.amount),
        this.creater.coin.rate
      );
      if (value) {
        this.balance = (round(value).toString());
      }
    }
  }

  isValidNumberString(current: string, num: string) {
    return (num === "." && !current.includes(num)) || num !== ".";
  }

  addAmountNumber(num: string) {
    const { coin, amount } = this.creater;
    const isDotIsOnce = this.isValidNumberString(amount, num)

    if (isDotIsOnce) {
      const nextAmount = amount + num;
      const balance = coin?.balanceUSD;

      !balance || balance > Number(nextAmount)
        ? this.creater.setAmount(nextAmount)
        : this.creater.setMax();
    }
    this.updateBalanceFromAmount()
  }

  removeAmountNumber() {
    this.creater.setAmount(this.creater.amount.slice(0, -1));
    this.updateBalanceFromAmount()
  }

  addBalanceNumber(num: string)
  {
    const { coin } = this.creater;
    const isDotIsOnce = this.isValidNumberString(this.balance, num)

    if (isDotIsOnce) {
      const nextBalance = this.balance + num
      const balance = coin?.balance;

      !balance || balance > Number(nextBalance)
        ? this.balance = nextBalance
        : this.creater.setMax();
    }
    this.updateAmountFromBalance()
  }

  removeBalanceNumber() {
    if(this.balance.length > 0) this.balance = this.balance.slice(0, -1)
    this.updateAmountFromBalance()
  }
}
