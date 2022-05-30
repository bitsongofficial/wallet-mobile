import { Derivator } from "core/types/utils/derivator"

export abstract class BaseDerivator implements Derivator {
	protected derivator?: Derivator

	constructor(derivator?: Derivator)
	{
		this.derivator = derivator
	}
	async Derive(data: any)
	{
		let calculatedData = data
		if(this.derivator) calculatedData = await this.derivator.Derive(data)
		calculatedData = await this.InnerDerive(calculatedData)
		return calculatedData
	}

	protected async InnerDerive(data: any)
	{
		return data
	}
}