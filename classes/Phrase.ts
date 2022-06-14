import { makeAutoObservable, runInAction } from "mobx";
import { Buffer } from "buffer";
import { bip39, getRandomValues, InputHandler } from "utils";

export default class Phrase {
  words: string[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isValid() {
    return true; // TODO: calc me
  }

  async create() {
    const words = await Phrase.generate();
    runInAction(() => {
      this.words = words;
    });
  }

  clear() {
    this.words = [];
  }

  addWord(word: string) {
    this.words?.push(word.toLowerCase());
  }

  setWords(words: string[]) {
    const lowerCaseWords = words.map((word) => word.toLowerCase());
    if (lowerCaseWords.every(Phrase.checkWord)) {
      this.words = lowerCaseWords;
    }
  }

  // -------------

  private input = new InputHandler();

  get inputValue() {
    return this.input.value;
  }

  get hint() {
    const value = this.input.value.toLowerCase();

    if (!value) return null;

    return Phrase.wordlist.find((word) => word.startsWith(value));
  }

  inputSubmit() {
    if (this.hint) {
      this.addWord(this.hint);
      this.input.clear();
    }
  }

  inputSet(value?: string) {
    this.input.set(value?.toLowerCase());
  }

  // -----------------

  static mock = new Array<string>(12).fill("test");

  static wordlist: string[] = bip39.wordlists.EN;
  static checkWord = (word: string) => Phrase.wordlist.includes(word); // TODO: check any params

  static async generate(strength: number = 128) {
    if (strength % 32 !== 0) {
      throw new TypeError("invalid entropy");
    }

    const buffer = Buffer.from(getRandomValues(new Uint8Array(strength / 8)));
    const mnemonic = bip39.entropyToMnemonic(buffer)
    return mnemonic.split(" ")
  }
}
