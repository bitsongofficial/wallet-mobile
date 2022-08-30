import { Phrase, Steps } from "classes"
import { InputHandler } from "utils"

export default class ConttrollerAddAccount {
	steps = new Steps(["Choose", "Create", "Name", "Import"])
	phrase = new Phrase()
	nameInput = new InputHandler()

	constructor() {}
}
