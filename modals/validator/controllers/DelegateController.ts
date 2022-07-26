import { AmountInput, Steps } from "classes"
import { IValidator } from "classes/types"
import { makeAutoObservable } from "mobx"

export default class DelegateController {
	steps = new Steps(["Delegate Import", "Delegate to", "Delegate Recap"])
	amountInput = new AmountInput()
	selectedValidator: IValidator | null = null

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setSelectedValidator(validator: IValidator) {
		this.selectedValidator = validator
	}

	clear() {
		this.steps.clear()
		this.amountInput.clear()
	}
}
