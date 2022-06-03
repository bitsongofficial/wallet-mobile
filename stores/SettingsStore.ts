import { makeAutoObservable } from "mobx";
import { ILang } from "screens/Profile/type";
import languages from "constants/languages";

export default class SettingsStore {
  theme: "light" | "dark" = "dark";
  language: ILang = languages[0];
  currency: Currency | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setTheme(theme: "light" | "dark") {
    this.theme = theme;
  }

  setLanguage(language: ILang) {
    this.language = language;
  }

  setCurrency(currency: Currency) {
    this.currency = currency;
  }
}
