import { makeAutoObservable } from "mobx"
import moment from "moment"
import { getRandomValues } from "utils"

export default class NotificationsStore {
	constructor(public list: Notif[] = []) {
		// todo remove
		makeAutoObservable(this, {}, { autoBind: true })
		this.set(mock)
	}

	set(list: Notif[]) {
		this.list = list
	}

	add(notif: Notif) {
		this.list.push(notif)
	}

	addMessage(message: string) {
		this.add({
			_id: getRandomValues(new Uint8Array(8)).toString(),
			message,
			date: new Date().toDateString(),
		})
	}

	clear() {
		this.list = []
	}
}

export type Notif = {
	_id: string
	message: string
	date?: string
}

const mock: Notif[] = [
	{ _id: "123456", message: "You swapped 20 BTSG", date: moment().subtract(1, "month").toString() },
	{
		_id: "12345",
		message: "Error swapping 2355 CLAY",
		date: moment().subtract(1, "week").toString(),
	},
	{ _id: "1234", message: "You swapped 20 LOBO", date: moment().subtract(1, "day").toString() },
	{ _id: "123", message: "You swapped 20 LOBO", date: moment().subtract(1, "hour").toString() },
	{ _id: "12", message: "You swapped 20 LOBO" },
]
