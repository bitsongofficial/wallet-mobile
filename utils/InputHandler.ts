import { makeAutoObservable } from "mobx";
import { FormEvent } from "react";

export default class InputHandler {
  isFocused = false;
  constructor(public value: string = "") {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  set(value: string = "") {
    this.value = value;
  }

  /** React FormEvent handler */
  setValue({ target }: FormEvent) {
    // @ts-ignore
    this.value = target.value;
  }

  focusON() {
    this.isFocused = true;
  }
  focusOFF() {
    this.isFocused = false;
  }

  clear() {
    this.value = "";
  }
}
