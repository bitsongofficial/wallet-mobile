import { autorun, makeAutoObservable, reaction, runInAction } from "mobx"
import moment, { Moment } from "moment"
import BackgroundTimer from "react-native-background-timer"

export default class TimerCountdown {
	finish: number = 0
	diff = 0
	intervalToken: any = 0

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })

		reaction(
		() => this.isActive,
		run =>
		{
			if(run) this.intervalToken = setInterval(() =>
			{
				this.updateDif()
			}, 1000)
			else
			{
				clearInterval(this.intervalToken)
			}
		})
	}

	get diffSec() {
		if (this.isActive) {
			return Math.round(this.diff / 1000)
		} else {
			return 0
		}
	}

	get isFinish() {
		return this.diff <= 0
	}

	get isActive() {
		return this.diff > 0
	}

	setFinishTime(time: number)
	{
		this.setFinish(moment().add(time))
	}

	setFinish(date: Date | Moment)
	{
		this.finish = date instanceof Date ? date.getTime() : date.milliseconds()
		this.updateDif()
	}

	updateDif()
	{
		this.diff = this.finish - (new Date()).getTime()
	}
}
