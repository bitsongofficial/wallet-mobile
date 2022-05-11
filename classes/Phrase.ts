import { makeAutoObservable } from "mobx";

export default class Phrase {
  words: string[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isValid() {
    return true; // TODO: calc me
  }

  create() {
    this.words = Phrase.mock;
  }

  add(word: string) {
    this.words?.push(word);
  }

  set(words: string[]) {
    this.words = words;
  }

  static mock = new Array<string>(24).fill("test");
}
