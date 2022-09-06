import { makeAutoObservable } from "mobx"
import { Pin, Steps } from "classes"

export default class ImportWithKeplrController {
	steps = new Steps(["Set PIN", "Confirm PIN"])

	pin = new Pin()
	confirm = new Pin()

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
