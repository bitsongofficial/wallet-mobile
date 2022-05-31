import { Coin } from "classes";
import Mock from "./mock";
import { makeAutoObservable } from "mobx";
import { round } from "utils";
import { IWallet } from "screens/Profile/type";

const rates = {
  juno: 13.35,
  bitsong: 0.06,
  osmosis: 4.39,
};

export default class Wallet {
  coins = [
    new Coin(Mock.BitSong, rates.bitsong),
    new Coin(Mock.Juno, rates.juno),
    new Coin(Mock.Osmosis, rates.osmosis),
  ];

  constructor(public info: IWallet) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get totalBalance() {
    return round(
      this.coins.reduce(
        (total, coin) => (coin.balanceUSD ? coin.balanceUSD + total : total),
        0
      )
    );
  }
}
