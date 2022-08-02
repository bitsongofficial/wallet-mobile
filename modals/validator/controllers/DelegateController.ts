import { AmountInput, Steps } from "classes"
import { Validator } from "core/types/coin/cosmos/Validator"
import { makeAutoObservable } from "mobx"

export default class DelegateController {
	steps = new Steps(["Delegate Import", "Delegate to", "Delegate Recap"])
	amountInput = new AmountInput()
	selectedValidator: Validator | null = null
	disableBack: boolean = false

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setSelectedValidator(validator: Validator) {
		this.selectedValidator = validator
	}

	clear() {
		this.steps.clear()
		this.amountInput.clear()
	}
}
