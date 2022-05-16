import { makeAutoObservable } from "mobx";
import { Pin, Steps } from "classes";

export default class ImportWithKeplrController {
  steps = new Steps(["Set PIN", "Confirm PIN"]);

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
        return this.pin.isValid;
      case 1:
        return this.confirm.isValid && this.pin.isValid && this.isConfirmEqual;
      default:
        return false;
    }
  }

  nextStep() {
    if (this.isCanNext) this.steps.next();
  }
}
