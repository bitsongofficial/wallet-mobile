import { makeAutoObservable } from "mobx";
import { ICurrency, ILang } from "screens/Profile/type";
import languages from "constants/languages";
import { NotifSettings, PinSettings } from "./type";

export default class SettingsStore {
  theme: "light" | "dark" = "dark";
  language: ILang = languages[0];
  currency: ICurrency | null = null;

  notifications: NotifSettings = {
    enable: true,
    history: 10,
  };

  pin: PinSettings = {
    enable: true,
    pin: null,
    biometric_enable: true,
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setTheme(theme: "light" | "dark") {
    this.theme = theme;
  }

  setLanguage(language: ILang) {
    this.language = language;
  }

  setCurrency(currency: ICurrency) {
    this.currency = currency;
  }

  setNotifications(settings: Partial<NotifSettings>) {
    this.notifications = { ...this.notifications, ...settings };
  }

  setPin(settings: Partial<PinSettings>) {
    this.pin = { ...this.pin, ...settings };
  }
}
