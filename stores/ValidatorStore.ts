import { IValidator } from "classes/types"
import { makeAutoObservable } from "mobx"

const mock = [
	{
		_id: "123",
		name: "Forbole",
		logo: "123451234",
		claim: 234.78,
		apr: 29.6,
		voting_power: 10.6,
		total: 4500000,
		address_operation: "bitsongval00000000000000000za9ssklclsd",
		address_account: "bitsongval00000000000000000za9ssklclsd",
		uptime: 100,
		maxConvertionRate: 100,
		currentCommissionRate: 12.5,
		lastCommissionChange: "Sun Oct 31 2021 00:00:00 GMT+0300",
	},
]

export default class ValidatorStore {
	validators: IValidator[] = [...mock]

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}
}
