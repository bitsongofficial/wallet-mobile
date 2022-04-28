import { ICoin } from "classes/types";

export default class Coin {
  constructor(public info: ICoin) {}

  get reward() {
    return "107.89"; // culc by this.info.balance
  }
}
