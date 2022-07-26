import { AmountInput, Steps } from "classes"
import { IValidator } from "classes/types"
import { makeAutoObservable } from "mobx"

export default class UndelegateController {
	steps = new Steps(["Undelegate Import", "Undelegate Recap"])
	amountInput = new AmountInput()
	from: IValidator | null = null

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setFrom(validator: IValidator) {
		this.from = validator
	}

	clear() {
		this.steps.clear()
		this.amountInput.clear()
	}
}
