import { DApp, User } from "classes";
import { makeAutoObservable } from "mobx";
import SettingsStore from "./SettingsStore";
import WalletStore from "./WalletStore";
import CoinStore from "./CoinStore";
import RemoteConfigsStore from "./RemoteConfigsStore";
import DappConnectionStore from "./DappConnectionStore";

export default class MainStore {
  auth = null;
  configs = {
    remote: new RemoteConfigsStore()
  };
  walletA = new WalletStore(this.configs.remote);
  walletStore = new WalletStore();
  settings = new SettingsStore();
  coin = new CoinStore(this.wallet, this.configs.remote);
  dapp = new DappConnectionStore(this.wallet);

  user: null | User = new User(); //  null;
  dapp = new DApp(); // MOck DApp functions

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get wallet() {
    return this.walletStore.active;
  }
}
