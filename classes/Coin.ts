import { makeAutoObservable } from "mobx";
import { ICoin } from "classes/types";

export default class Coin {
  constructor(public info: ICoin, public rate: number | null = null) {
    makeAutoObservable(this, {}, { autoBind: true });
  }


  get reward() {
    return "107.89"; // culc by this.info.balance
  }
}
