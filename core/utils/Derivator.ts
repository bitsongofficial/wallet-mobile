import { Derivator } from "core/types/utils/derivator"

export abstract class BaseDerivator implements Derivator {
	protected derivator?: Derivator

	constructor(derivator?: Derivator)
	{
		this.derivator = derivator
	}
	async Derive(data: any)
	{
		const calculatedData = await this.InnerDerive(data)
		if(this.derivator) return this.derivator.Derive(calculatedData)
		return calculatedData
	}

	protected abstract InnerDerive(data: any) : Promise<any>
}