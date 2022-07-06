import { User } from "classes";
import { makeAutoObservable } from "mobx";
import SettingsStore from "./SettingsStore";
import WalletStore from "./WalletStore";
import CoinStore from "./CoinStore";
import RemoteConfigsStore from "./RemoteConfigsStore";
import DappConnectionStore from "./DappConnectionStore";
import ContactsStore from "./ContactsStore";

export default class MainStore {
  auth = null;
  configs = {
    remote: new RemoteConfigsStore(),
  };
  wallet = new WalletStore(this.configs.remote);
  settings = new SettingsStore();
  coin = new CoinStore(this.wallet, this.configs.remote);
  dapp = new DappConnectionStore(this.wallet, this.configs.remote);

  contacts = new ContactsStore();
  user: null | User = new User({
    _id: "1234",
    address: "bitsong16h2ry9axyvzwkftv93h6nusdqeqdn552skxxtw",
  }); //  null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
