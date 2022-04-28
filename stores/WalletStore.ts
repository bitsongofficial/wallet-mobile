import { Coin } from "classes";
import Mock from "./mock";

export default class WalletStore {
  coins = [new Coin(Mock.BitSong), new Coin(Mock.Juno), new Coin(Mock.Osmosis)];
  constructor() {}
}
