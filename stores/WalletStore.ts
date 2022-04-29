import { Coin } from "classes";
import Mock from "./mock";
import { makeAutoObservable } from "mobx";

export default class WalletStore {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

}
