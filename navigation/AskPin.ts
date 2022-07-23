
// ----------- Pin ------------

import { useStore } from "hooks";
import { store } from "stores/Store";
import { RootStackParamList } from "types";
import { getPin } from "utils/biometrics";
import { navigate } from "./utils";

export type OptionsAskPin = Omit<RootStackParamList["PinRequest"], "callback">;

export function askPin(options?: OptionsAskPin) {
  const defaultOptions: OptionsAskPin = {
    isHiddenCode: true,
    isRandomKeyboard: false,
  };
  const { settings } = store
  if(settings.biometric_enable) return new Promise<string>(async (resolve, reject) =>
  {
    const pin = await getPin()
    if(pin) resolve(pin)
    reject()
  })
  return new Promise<string>((resolve, reject) =>
    navigate("PinRequest", {
      callback: (result: any) => {(result ? resolve(result) : reject())},
      ...defaultOptions,
      ...options,
    })
  );
}