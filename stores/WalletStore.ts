import { Coin, Wallet } from "classes";
import Mock from "../classes/mock";
import { makeAutoObservable } from "mobx";
import { round } from "utils";

const rates = {
  juno: 13.35,
  bitsong: 0.06,
  osmosis: 4.39,
};

export default class WalletStore {
  wallets = [
    new Wallet({
      name: "Gianni Wallet",
      address: "1",
      type: "one", // ?
    }),
    new Wallet({
      name: "Airdrop Fund Wallet",
      address: "2",
      type: "one",
    }),
    new Wallet({
      name: "Cold Wallet",
      address: "3",
      type: "two",
    }),
  ];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  active = this.wallets[0];

  setActive(wallet: Wallet) {
    this.active = wallet;
  }

  deleteWallet(wallet: Wallet) {
    console.log(
      "deleteWAllet",
      wallet.info.name,
      this.wallets.findIndex((item) => item === wallet)
    );
    this.wallets = this.wallets.splice(
      this.wallets.findIndex((item) => item === wallet),
      1
    );
  }
}
