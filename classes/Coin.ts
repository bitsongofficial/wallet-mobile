import { makeAutoObservable } from "mobx";
import { ICoin } from "classes/types";
import { round } from "utils";

export default class Coin {
  constructor(public info: ICoin, public rate: number | null = null) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get balance() {
    return round(this.info.balance);
  }

  get balanceUSD() {
    const value = Coin.culcFiatBalance(this.info.balance, this.rate);

    return value ? round(value) : null;
  }

  increment() {
    this.info.balance = this.info.balance + 1;
  }

  static culcFiatBalance(tokenBalance: number, rate?: number | null) {
    return rate ? rate * tokenBalance : null;
  }

  static culcTokenBalance(fiatBalance: number, rate?: number) {
    return rate ? fiatBalance / rate : null;
  }
}
