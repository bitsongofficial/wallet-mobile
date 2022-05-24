import { DApp, User } from "classes";
import { makeAutoObservable } from "mobx";
import SettingsStore from "./SettingsStore";
import WalletStore from "./WalletStore";

export default class MainStore {
  auth = null;
  wallet = new WalletStore();
  settings = new SettingsStore();

  user: null | User = new User(); //  null;
  dapp = new DApp(); // MOck DApp functions

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
