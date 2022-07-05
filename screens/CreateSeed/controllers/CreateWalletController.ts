import { makeAutoObservable } from "mobx";
import { InputHandler } from "utils";
import { Pin, Steps, Phrase } from "classes";

export default class CreateWalletController {
  steps = new Steps([
    "Create New Mnemonic",
    "Name Your Wallet",
    "Set PIN",
    "Confirm PIN",
    "Choice Auth Method",
  ]);

  phrase = new Phrase();
  walletName = new InputHandler();
  pin = new Pin();
  confirm = new Pin();

  isPhraseShown = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get isConfirmEqual() {
    return this.confirm.value === this.pin.value;
  }

  get isCanNext() {
    switch (this.steps.active) {
      case 0:
        return true; //AAA this.biometric.access; or this.isPhraseShown
      case 1:
        return this.walletName.value.length > 3;
      case 2:
        return true; //AAA this.pin.isValid;
      case 3:
        return true; //AAA this.confirm.isValid && this.pin.isValid && this.isConfirmEqual;
      default:
        return false;
    }
  }

  nextStep() {
    if (this.isCanNext) this.steps.next();
  }

  setPhraseShown(value: boolean) {
    this.isPhraseShown = value;
  }
}
