import { makeAutoObservable } from "mobx"
import { Emitter, Handler } from "utils"
import moment, { Moment } from "moment"

export default class TimerCountdown {
	emmiter = new Emitter<TimerHandlers>()
	now: Moment = moment()
	finish: Moment | null = null
	time = 0
	token: number | null = null
	isActive: boolean = false

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	get diffSec() {
		if (this.finish) {
			return Math.round(this.finish.diff(this.now, "millisecond") / 1000)
		} else {
			return this.time
		}
	}

	get isFinish() {
		return this.diffSec <= 0
	}

	start() {
		this.isActive = true
		this.now = moment()

		if (!this.finish) {
			this.setFinish(moment(this.now).add(this.time, "second"))
		}

		this.tickTack()
		this.emmiter.emit("start")
	}

	stop() {
		this.token && clearTimeout(this.token)
		this.token = null
		this.isActive = false
		this.setFinish(null)
		this.setFinishTime(0)
		this.emmiter.emit("stop")
	}

	setFinishTime(time: number) {
		this.time = time
	}

	setFinish(date: Date | Moment | null) {
		this.finish = date ? moment(date) : date
	}

	private tick() {
		this.now = moment()
		if (this.isFinish) {
			this.stop()
		} else {
			this.tickTack()
		}
	}

	private tickTack() {
		this.token = setTimeout(this.tick, 1000) // TODO: Some problem, culc after first secon
	}
}

type TimerHandlers = {
	start?: Handler
	stop?: Handler
}
