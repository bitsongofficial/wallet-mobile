import { assertIsDeliverTxSuccess, GasPrice, SigningStargateClient } from "@cosmjs-rn/stargate";
import axios from "axios";
import { validatorIdentity } from "core/rest/keybase";
import { DelegateData } from "core/types/coin/cosmos/DelegateData";
import { Validator, ValidatorStatus } from "core/types/coin/cosmos/Validator";
import { CosmosOperation } from "./CosmosOperation";

const getValidatorStatus = (validator: any) => {
	if (validator.status.toString() === '3') {
		return {
			status: ValidatorStatus.ACTIVE,
			statusDetailed: 'active',
		}
	}
	if (
	  validator.signing_info &&
	  new Date(validator.signing_info.jailed_until) > new Date(9000, 1, 1)
	)
	{
		return {
			status: ValidatorStatus.INACTIVE,
			statusDetailed: 'banned',
		}
	}
  
	return {
		status: ValidatorStatus.INACTIVE,
		statusDetailed: 'inactive',
	}
}

export class Validators extends CosmosOperation {
	async Run() {
		try
		{
			const service = this.coin.explorer()
			const results = (await service.get("/cosmos/staking/v1beta1/validators")).data.validators

			const validators:Validator[] = results.map((v:any):Validator =>
				({
					id: v.description.moniker,
					identity: v.description.identiy,
					name: v.description.moniker,
					logo: "",
					description: v.description.details,
					status: getValidatorStatus(v),
					operator: v.operator_address,
					tokens: parseInt(v.tokens),
					// uptime: 0,
					apr: Math.random() * 100,
					userClaimAmount: 0,
					userDelegation: 0,
					commission: {
						rate: {
							max: parseFloat(v.commission.commission_rates.max_rate),
							current: parseFloat(v.commission.commission_rates.rate),
						},
						change: {
							max: parseFloat(v.commission.commission_rates.max_change_rate),
							last: new Date(v.commission.update_time),
						}
					},
				}))
			await Promise.allSettled(validators.map(v => (new Promise(async (resolve, reject) =>
				{
					try
					{
						const valIdentity = await validatorIdentity(v.identity)
						// v.name = valIdentity.full_name ?? ""
						v.logo = valIdentity.picture_url
						resolve(true)
					}
					catch(e)
					{
						reject()
					}
				}))))
			return validators
		}
		catch(e)
		{
			console.error("Catched", e)
		}
		return []
	}
}