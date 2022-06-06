import { makeAutoObservable } from "mobx";
import SettingsStore from "./SettingsStore";
import WalletStore from "./WalletStore";
import CoinStore from "./CoinStore";
import RemoteConfigsStore from "./RemoteConfigsStore";

export default class MainStore {
  auth = null;
  configs = {
    remote: new RemoteConfigsStore()
  };
  wallet = new WalletStore(this.configs.remote);
  settings = new SettingsStore();
  coin = new CoinStore(this.wallet, this.configs.remote);

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
