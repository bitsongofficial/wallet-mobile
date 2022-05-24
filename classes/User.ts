import { makeAutoObservable } from "mobx";

export default class User {
  nick: string = "";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setNick(nick: string) {
    this.nick = nick;
  }
}
