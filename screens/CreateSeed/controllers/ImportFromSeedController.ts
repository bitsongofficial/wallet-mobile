import { makeAutoObservable } from "mobx"
import { InputHandler } from "utils"
import { Pin, Steps, Phrase } from "classes"

export default class ImportFromSeedController {
	steps = new Steps(["Import your Mnemonic", "Name Your Wallet", "Set PIN", "Confirm PIN"])
	phrase = new Phrase()
	inputWord = new InputHandler()
	walletName = new InputHandler()
	pin = new Pin()
	confirm = new Pin()

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
