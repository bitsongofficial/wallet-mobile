import { AmountInput, Steps } from "classes"
import { Validator } from "core/types/coin/cosmos/Validator"
import { makeAutoObservable } from "mobx"

export default class UndelegateController {
	steps = new Steps(["Undelegate Import", "Undelegate Recap"])
	amountInput = new AmountInput()
	from: Validator | null = null

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setFrom(validator: Validator) {
		this.from = validator
	}

	clear() {
		this.steps.clear()
		this.amountInput.clear()
	}
}
