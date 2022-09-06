import { makeAutoObservable } from "mobx"

/**
 * @example
 * const showError = async () => {
 *    gav.open("Test Error")
 *    await wait(2000)
 *    gav.close()
 * }
 */

export default class GlobalAlertView {
	isShow = false
	message: string | null = null

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setMessage(message: string | null) {
		this.message = message
	}

	open(message?: string | null) {
		message && this.setMessage(message)
		this.isShow = true
	}

	close() {
		this.isShow = false
	}
}
