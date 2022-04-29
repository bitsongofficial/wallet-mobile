import { makeAutoObservable } from "mobx";
import SettingsStore from "./SettingsStore";
import WalletStore from "./WalletStore";

export default class MainStore {
  auth = null;
  wallet = new WalletStore();
  settings = new SettingsStore();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
