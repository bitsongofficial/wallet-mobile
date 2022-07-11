import { makeAutoObservable, reaction } from "mobx";
import { ICurrency, ILang } from "screens/Profile/type";
import languages from "constants/languages";
import currencies from "constants/currencies";
import { CheckMethod, NotifSettings, PinSettings } from "./type";
import AsyncStorageLib from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import { PermissionsAndroid } from "react-native";
import { argon2Encode, argon2Verify } from "utils/argon";
import { askPin } from "navigation/AskPin";

const pin_hash_path = "pin_hash"

export default class SettingsStore {
  theme: "light" | "dark" = "dark";
  language: ILang = languages[0];
  currency: ICurrency | null = currencies[0];
  checkMethod: CheckMethod | null = null;
  biometric_enable = true;

  notifications: NotifSettings = {
    enable: true,
    history: 10,
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

  setCheckMethod(checkMethod: CheckMethod) {
    this.checkMethod = checkMethod;
  }

  setBiometric(biometric_enable: boolean) {
    this.biometric_enable = biometric_enable
  }

  async setPin(pin: string): Promise<void> {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED)
    {
      const encodedHash = await argon2Encode(pin)
      await AsyncStorageLib.setItem(pin_hash_path, encodedHash)
    }
  }

  async changePhin(newPin: string) {
    const pin = this.askPin()

  }

  async verifyPin(pin: string): Promise<boolean> {
    if(pin == "") return false
    try
    {
      const storedHash = await AsyncStorageLib.getItem(pin_hash_path)
      if(storedHash)
      {
        return await argon2Verify(pin, storedHash)
      }
      else
      {
        this.setPin(pin)
        return true
      }
    }
    catch(e)
    {
    }
    return false
  }

  async askPin()
  {
    return await askPin()
  }
}
