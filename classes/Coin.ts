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
    return this.rate ? round(this.rate * this.info.balance) : null;
  }

  get reward() {
    return "107.89"; // culc by this.info.balance
  }
}
