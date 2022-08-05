import { Steps } from "classes"
import { makeAutoObservable } from "mobx"
import { ProfileWallets } from "stores/WalletStore"
import { InputHandler } from "utils"

export default class ControllerChangeWallet {
	steps = new Steps(["Seleziona Wallet", "Edit Wallet", "View Mnemonic Seed"])

	inputSearch = new InputHandler()
	inputWalletName = new InputHandler()
	edited: ProfileWallets | null = null
	selected: ProfileWallets | null = null

	seedPhrase: string[] = []

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setEdited(profile: ProfileWallets | null) {
		if (profile) {
			this.steps.goTo("Edit Wallet")
		}
		this.edited = profile
	}

	setSelected(profile: ProfileWallets | null) {
		this.selected = profile
	}

	saveName() {
		const { edited, inputWalletName } = this
		if (edited) edited.profile.name = inputWalletName.value
	}

	setPhrase(phrase: string[]) {
		console.log("phrase isArray", Array.isArray(phrase))
		this.seedPhrase = phrase
	}
}
