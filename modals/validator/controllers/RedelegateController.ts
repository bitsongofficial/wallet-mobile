import { AmountInput, Steps } from "classes"
import { Validator } from "core/types/coin/cosmos/Validator"
import { makeAutoObservable } from "mobx"

export default class RedelegateController {
	steps = new Steps(["Redelegate Import", "Redelegate to", "Redelegate Recap"])
	amountInput = new AmountInput()
	disableBack: boolean = false

	from: Validator | null = null
	to: Validator | null = null

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setFrom(validator: Validator) {
		this.from = validator
	}

	setTo(validator: Validator) {
		this.to = validator
	}

	clear() {
		this.steps.clear()
		this.amountInput.clear()
	}
}
