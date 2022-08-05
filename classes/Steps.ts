import { makeAutoObservable } from "mobx"

export default class Steps<T extends string = any> {
	active = 0
	history: number[] = [this.active]

	constructor(public titles: T[]) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	clear() {
		this.active = 0
		this.history = [0]
	}

	get title() {
		return this.titles[this.active]
	}

	setActive(index?: number) {
		if (index !== undefined) this.active = index
	}

	private add(index: number) {
		console.log("add 0", this.history)
		if (index >= 0 && index <= this.titles.length - 1) {
			this.history.push(index)
			this.setActive(index)
		}
		console.log("add 1", this.history)
	}

	goBack() {
		console.log("back 0", this.history)
		this.history.pop()
		this.setActive(this.history[this.history.length - 1])
		console.log("back 1", this.history)
	}

	goTo(title: T) {
		console.log("go to", this.history)
		this.add(this.titles.findIndex(Steps.equal(title)))
	}

	next() {
		this.add(this.active + 1)
	}

	prev() {
		this.add(this.active - 1)
	}

	static equal = (title: string) => (t: string) => t === title
}
