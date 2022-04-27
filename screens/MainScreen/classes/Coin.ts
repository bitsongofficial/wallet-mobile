import { ICoin } from "screens/MainScreen/types";

export default class Coin {
  constructor(public info: ICoin) {}

  get reward() {
    return "107.89"; // culc by this.info.balance
  }
}
