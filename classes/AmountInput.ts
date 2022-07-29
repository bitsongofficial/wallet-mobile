import Coin from "classes/Coin"
import { makeAutoObservable } from "mobx"

export default class AmountInput {
	coin: Coin | null = null
	value: string = "" // usd

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setCoin(coin: Coin) {
		this.coin = coin
	}
	setAmount(value: string) {
		this.value = value
	}
	setMax() {
		if (this.coin?.balance) {
			this.value = this.coin.balance.toString()
		}
	}

	addAmountNumber(num: string) {
		const { coin, value } = this
		const isDotIsOnce = AmountInput.isValidNumberString(value, num)

		if (isDotIsOnce) {
			const nextAmount = value + num
			const balance = coin?.balance

			balance == undefined || balance < Number(nextAmount)
				?
				this.setMax()
				:
				this.setAmount(nextAmount)
		}
	}

	removeAmountNumber() {
		this.setAmount(this.value.slice(0, -1))
	}

	clear() {
		this.value = ""
	}

	static isValidNumberString(current: string, num: string) {
		return (num === "." && !current.includes(num)) || num !== "."
	}
}
