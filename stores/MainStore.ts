import { User } from "classes";
import { makeAutoObservable } from "mobx";
import SettingsStore from "./SettingsStore";
import WalletStore from "./WalletStore";
import CoinStore from "./CoinStore";
import RemoteConfigsStore from "./RemoteConfigsStore";
import DappConnectionStore from "./DappConnectionStore";
import LocalStorageManager from "./LocalStorageManager";
import ContactsStore from "./ContactsStore";

export default class MainStore {
  auth = null;
  configs = {
    remote: new RemoteConfigsStore(),
  };
  settings = new SettingsStore();
  wallet = new WalletStore(this.settings, this.configs.remote);
  coin = new CoinStore(this.wallet, this.configs.remote, this.settings);
  dapp = new DappConnectionStore(this.wallet, this.coin, this.configs.remote, this.settings);
  contacts = new ContactsStore()
  localStorageManager = new LocalStorageManager(this.wallet, this.dapp, this.settings, this.configs.remote, this.contacts)

  user: null | User = new User({
    _id: "1234",
    address: "bitsong16h2ry9axyvzwkftv93h6nusdqeqdn552skxxtw",
    avatar: null,
    firstName: "",
    lastName: "",
  }); //  null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
