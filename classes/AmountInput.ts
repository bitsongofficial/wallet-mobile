import Coin from "classes/Coin"
import { makeAutoObservable } from "mobx"

export default class AmountInput {
	coin: Coin | null = null

	/**
	 *	value of type string, because the class is designed
	 *  to interact with the component components/molecules/Numpad
	 */
	value: string = "" // usd
	constructor(
		/** Explicitly specified maximum input value  */
		public maxValue: number | null = null,
	) {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	updMaxValue(value?: number | null) {
		if (value) {
			this.maxValue = value
		}
	}
	setCoin(coin: Coin) {
		this.coin = coin
	}
	setAmount(value: string) {
		this.value = value
	}
	setMax() {
		if (this.maxValue) {
			this.value = this.maxValue.toString()
		} else if (this.coin?.balance) {
			this.value = this.coin.balance.toString()
		}
	}

	addAmountNumber(num: string) {
		const { coin, value } = this
		const isDotIsOnce = AmountInput.isValidNumberString(value, num)

		if (isDotIsOnce) {
			const nextAmount = value + num
			const balance = coin?.balance

			if (
				(this.maxValue !== null && this.maxValue < Number(nextAmount)) ||
				(balance !== undefined && balance < Number(nextAmount))
			) {
				this.setMax()
			} else {
				this.setAmount(nextAmount)
			}
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
