import { AmountInput, Steps } from "classes"
import { IValidator } from "classes/types"
import { makeAutoObservable } from "mobx"

export default class RedelegateController {
	steps = new Steps(["Redelegate Import", "Redelegate to", "Redelegate Recap"])
	amountInput = new AmountInput()

	from: IValidator | null = null
	to: IValidator | null = null

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setFrom(validator: IValidator) {
		this.from = validator
	}

	setTo(validator: IValidator) {
		this.to = validator
	}

	clear() {
		this.steps.clear()
		this.amountInput.clear()
	}
}
