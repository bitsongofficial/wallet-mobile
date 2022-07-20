import { makeAutoObservable } from "mobx";
import { ICurrency, ILang } from "screens/Profile/type";
import languages from "constants/languages";
import currencies from "constants/currencies";
import { CheckMethod, NotifSettings } from "./type";
import LocalStorageManager from "./LocalStorageManager";
import { clearPin, savePin } from "utils/biometrics";
import { askPin } from "navigation/AskPin";

export default class SettingsStore {
	localStorageManager?: LocalStorageManager

  theme: "light" | "dark" = "dark";
  language: ILang = languages[0];
  currency: ICurrency | null = currencies[0];
  checkMethod: CheckMethod | null = null;
  biometric_enable = false;

  notifications: NotifSettings = {
    enable: true,
    history: 10,
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setTheme(theme: "light" | "dark")
  {
    this.theme = theme;
  }

  setLanguage(language: ILang)
  {
    this.language = language;
  }

  setCurrency(currency: ICurrency)
  {
    this.currency = currency;
  }

  setNotifications(settings: Partial<NotifSettings>)
  {
    this.notifications = { ...this.notifications, ...settings };
  }

  setCheckMethod(checkMethod: CheckMethod)
  {
    this.checkMethod = checkMethod;
  }

  setBiometricInternal(biometric_enable: boolean)
  {
    this.biometric_enable = biometric_enable
  }

  async setBiometric(biometric_enable: boolean, pin?: string)
  {
    console.log(this.biometric_enable, biometric_enable, pin)
    if(!this.biometric_enable && biometric_enable)
    {
      const actualPin = pin ?? await askPin()
      if(actualPin != "")
      {
        await savePin(actualPin)
        this.setBiometricInternal(biometric_enable)
      }
    }
    if(this.biometric_enable && !biometric_enable)
    {
      const res = await clearPin()
      if(res) this.setBiometricInternal(biometric_enable)
    }
  }
}
