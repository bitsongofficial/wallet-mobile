import { makeAutoObservable } from "mobx";

export default class Pin {
  value = "";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isValid() {
    return this.value.length === 7;
  }

  push(num: string) {
    if (this.value.length < Pin.max) {
      this.value = this.value + num;
    }
  }

  remove() {
    this.value = this.value.slice(0, -1);
  }

  static max = 7;
}
