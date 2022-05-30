import { makeAutoObservable } from "mobx";

export default class SettingsStore {
  theme: "light" | "dark" = "dark";
  language: string = "en";
  currency: Currency | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setTheme(theme: "light" | "dark") {
    this.theme = theme;
  }

  setLenguage(language: string) {
    this.language = language;
  }

  setCurrency(currency: Currency) {
    this.currency = currency;
  }
}
