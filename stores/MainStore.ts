import { makeAutoObservable } from "mobx";
import SettingsStore from "./SettingsStore";
import WalletStore from "./WalletStore";
import CoinStore from "./CoinStore";

export default class MainStore {
  auth = null;
  wallet = new WalletStore();
  settings = new SettingsStore();
  coin = new CoinStore(this.wallet);

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
