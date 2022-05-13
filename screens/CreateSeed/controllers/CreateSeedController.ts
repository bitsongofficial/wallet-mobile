import { useMemo } from "react";
import { makeAutoObservable } from "mobx";
import { InputHandler } from "utils";
import { Pin, Steps, Phrase, Biometric } from "classes";

export default class CreateSeedController {
  steps = new Steps([
    "Create New Mnemonic",
    "Name Your Wallet",
    "Set PIN",
    "Confirm PIN",
  ]);

  phrase = new Phrase();
  biometric = new Biometric();
  walletName = new InputHandler();
  pin = new Pin();
  confirm = new Pin();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isConfirmEqual() {
    return this.confirm.value === this.pin.value;
  }

  get isCanNext() {
    switch (this.steps.active) {
      case 0:
        return this.biometric.access;
      case 1:
        return this.walletName.value.length > 3;
      case 2:
        return this.pin.isValid;
      case 3:
        return this.confirm.isValid && this.pin.isValid && this.isConfirmEqual;
      default:
        return false;
    }
  }

  nextStep() {
    if (this.isCanNext) this.steps.next();
  }
}

export function useCreateSeedController() {
  return useMemo(() => new CreateSeedController(), []);
}