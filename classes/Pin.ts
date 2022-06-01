import { makeAutoObservable } from "mobx";
import { shuffleArray, sliceIntoChunks } from "utils";

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

  static numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];

  static getRandomKeyboard() {
    const flat = shuffleArray([...Pin.numbers]);
    flat.push("C");
    return sliceIntoChunks(flat, 3);
  }
}
