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
		if (index >= 0 && index <= this.titles.length - 1) {
			this.history.push(index)
			this.setActive(index)
		}
	}

	goBack() {
		this.history.pop()
		this.setActive(this.history[this.history.length - 1])
	}

	goTo(title: T) {
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
