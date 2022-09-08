import { makeAutoObservable } from "mobx"

type GlobalAlertErrorMessage = string | string[] | null

export default class GlobalAlertView {
	message: GlobalAlertErrorMessage = null

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setMessage(message: GlobalAlertErrorMessage) {
		this.message = message || null
	}

	close() {
		this.setMessage(null)
	}

	get isShow() {
		return !!this.text
	}

	get text() {
		if (this.message) {
			if (Array.isArray(this.message)) {
				return this.message.length > 0 ? this.message[0] : null
			} else {
				return this.message
			}
		} else {
			return null
		}
	}
}
