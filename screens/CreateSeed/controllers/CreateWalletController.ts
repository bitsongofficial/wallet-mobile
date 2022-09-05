import { makeAutoObservable } from "mobx"
import { InputHandler } from "utils"
import { Pin, Steps, Phrase } from "classes"

export default class CreateWalletController {
	steps = new Steps([
		"Create New Mnemonic",
		"Name Your Wallet",
		"Set PIN",
		"Confirm PIN",
		"Choice Auth Method",
	])

	phrase = new Phrase()
	walletName = new InputHandler()
	pin = new Pin()
	confirm = new Pin()

	isPhraseShown = false

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setPhraseShown(value: boolean) {
		this.isPhraseShown = value
	}
}
