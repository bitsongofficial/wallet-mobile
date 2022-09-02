import { makeAutoObservable } from "mobx"

// It is advisable to store the state in isolation from
// the business logic of the application
export default class GlobalLoading {
	isOpen: boolean = false
	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	open() {
		this.isOpen = true
	}
	close() {
		this.isOpen = false
	}
	toggle() {
		this.isOpen ? this.close() : this.open()
	}
}
