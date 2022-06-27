import { makeAutoObservable } from "mobx";
import { shuffleArray, sliceIntoChunks } from "utils";

export default class Pin {
  value = "";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isValid() {
    return this.value.length === Pin.max;
  }

  push(num: string) {
    if (this.value.length < Pin.max) {
      this.value = this.value + num;
    }
  }

  remove() {
    this.value = this.value.slice(0, -1);
  }

  clear() {
    this.value = "";
  }

  static max = 7;

  static numbers: (string | undefined)[] = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
  ];

  static getKeyboard(options?: KeyboardOptions): (string | undefined)[][] {
    const flat = [...Pin.numbers];
    if (options?.random) {
      shuffleArray(flat);
    }
    flat.splice(9, 0, undefined);
    flat.push("C");
    return sliceIntoChunks(flat, 3);
  }
}

type KeyboardOptions = { random?: boolean };
