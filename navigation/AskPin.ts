
// ----------- Pin ------------

import { RootStackParamList } from "types";
import { navigate } from "./utils";

export type OptionsAskPin = Omit<RootStackParamList["PinRequest"], "callback">;

export function askPin(options?: OptionsAskPin) {
  const defaultOptions: OptionsAskPin = {
    isHiddenCode: true,
    isRandomKeyboard: false,
  };

  return new Promise<string>((resolve, reject) =>
    navigate("PinRequest", {
      callback: (result: any) => (result ? resolve(result) : reject()),
      ...defaultOptions,
      ...options,
    })
  );
}