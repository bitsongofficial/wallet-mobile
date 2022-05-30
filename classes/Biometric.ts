import { makeAutoObservable } from "mobx";

export default class Biometric {
  access = false;
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setAccess(access: boolean) {
    this.access = access;
  }
}
