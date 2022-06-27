import { makeAutoObservable } from "mobx";
import { ICurrency, ILang } from "screens/Profile/type";
import languages from "constants/languages";
import currencies from "constants/currencies";
import { CheckMethod, NotifSettings, PinSettings } from "./type";

export default class SettingsStore {
  theme: "light" | "dark" = "dark";
  language: ILang = languages[0];
  currency: ICurrency | null = currencies[0];
  checkMethod: CheckMethod | null = null;
  showLoadingOverlay = false;

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

  setCheckMethod(checkMethod: CheckMethod) {
    this.checkMethod = checkMethod;
  }

  setShowLoadingOverlay(show: boolean)
  {
    this.showLoadingOverlay = show
  }
}
