import { assertIsDeliverTxSuccess, GasPrice, SigningStargateClient } from "@cosmjs-rn/stargate";
import axios from "axios";
import { DelegateData } from "core/types/coin/cosmos/DelegateData";
import { CosmosOperation } from "./CosmosOperation";

export class Validators extends CosmosOperation {
	async Run() {
		try
		{
			const service = this.coin.explorer()
			const validatorInfosRequests = []
			validatorInfosRequests.push(service.get("staking/validators"))
			validatorInfosRequests.push(service.get("/validatorsets/latest"))
			const results = (await Promise.all(validatorInfosRequests)).map(r => (r.data.result.validators ?? r.data.result))
			results[0].forEach((element:any) => {
				//console.log(element.operator_address)
				element.voting_power = results[1].find((e2:any) => 
				{
					if(e2.address == element.operator_address)
					{
						return true
					}
					return false
				}).voting_power
			});
			const validators = results[0]
			return validators
			//console.log("B", validators)
		}
		catch(e)
		{
			console.log(e)
		}
		return []
	}
}