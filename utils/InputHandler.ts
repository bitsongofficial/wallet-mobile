import { makeAutoObservable } from "mobx"

export default class InputHandler {
	isFocused = false
	constructor(public value: string = "") {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	get lowerCaseValue() {
		return this.value.toLowerCase()
	}

	set(value: string = "") {
		this.value = value
	}

	focusON() {
		this.isFocused = true
	}
	focusOFF() {
		this.isFocused = false
	}

	clear() {
		this.value = ""
	}
}
