import { makeAutoObservable, runInAction } from "mobx";

export default class DApp {
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  loading = {
    checkNick: false,
  };

  async checkNick(nick: string) {
    return true;
  }
}
