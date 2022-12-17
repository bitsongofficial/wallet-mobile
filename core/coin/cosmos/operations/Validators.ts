import { assertIsDeliverTxSuccess, GasPrice, SigningStargateClient } from "@cosmjs-rn/stargate";
import axios from "axios";
import { validatorIdentity, validatorsPictures } from "core/rest/keybase";
import { DelegateData } from "core/types/coin/cosmos/DelegateData";
import { SignerInfo, Validator, ValidatorStatus, ValidatorStatusRequest } from "core/types/coin/cosmos/Validator";
import { CosmosOperation } from "./CosmosOperation";

const getValidatorStatus = (validator: any) => {
	if (validator.status.toString() === ValidatorStatusRequest.BOND_STATUS_BONDED) {
		return {
			status: ValidatorStatus.ACTIVE,
			statusDetailed: 'active',
		}
	}
	if (validator.jailed)
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

			const validators: Validator[] = results.map((v:any):Validator =>
				({
					id: v.description.moniker,
					identity: v.description.identity,
					name: v.description.moniker,
					logo: "",
					description: v.description.details,
					status: getValidatorStatus(v),
					operator: v.operator_address,
					tokens: parseInt(v.tokens),
					// uptime: 0,
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
			const usernames = validators.map(v => v.id.slice(0, 15).replace(/\s+/g, '').replace(/\[.*\]/g, '').replace(/\(.*\)/g, '').replace(/\W/g, ''))
			const emptyUsernameIndexes: number[] = []
			usernames.forEach((u, i) =>
				{
					if(u == undefined || u == "") emptyUsernameIndexes.push(i)
				})
			const validUsernames = usernames.filter(u => u != undefined && u != "")
			const usernameChunks: string[][] = []
			const chunkSize = 50
			for (let i = 0; i < validUsernames.length; i += chunkSize)
			{
				usernameChunks.push(validUsernames.slice(i, i + chunkSize))
			}
			let pictures: string[] = []
			await Promise.all(usernameChunks.map(async c =>
				{
					pictures = pictures.concat(await validatorsPictures(c))
				}))
			validators.forEach((v, index) =>
			{
				const offset = emptyUsernameIndexes.reduce((count, i) => (index >= i ? count + 1 : count), 0)
				validators[index].logo = emptyUsernameIndexes.indexOf(index) >= 0 ? undefined : pictures[index - offset]
			})
			return validators
		}
		catch(e)
		{
			console.error("Catched", e)
		}
		return []
	}
}