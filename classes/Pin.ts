import { makeAutoObservable, reaction } from "mobx";

export default class Pin {
  value = "";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isValid() {
    return this.value.length > 7;
  }

  push(num: string) {
    console.log("num", num);
    if (this.value.length < Pin.max) {
      console.log("push num", num);
      this.value = this.value + num;
    }
  }

  remove() {
    this.value = this.value.slice(-1);
  }

  static max = 7;
}
