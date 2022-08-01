import { DelegationsData } from "core/types/coin/cosmos/DelegationsData";
import { Proposal } from "core/types/coin/cosmos/Proposal";
import { Reward } from "core/types/coin/cosmos/Rewards";
import { RewardsData } from "core/types/coin/cosmos/RewardsData";
import { Amount } from "core/types/coin/Generic";
import { ProposalStatus } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { CosmosOperation } from "./CosmosOperation";

export class Delegations extends CosmosOperation {
	async Run(data: DelegationsData) {
		try
		{
			const service = this.coin.explorer()
			const address = await data.delegator.Address()
			const delegationsRaw = (await service.get(`/cosmos/staking/v1beta1/delegations/${address}`)).data.delegation_responses
			const delegations = delegationsRaw.map((d:any) =>
			({
				validatorAddress: d.delegation.validator_address as string,
				amount: d.balance as Amount
			}))
			return delegations
		}
		catch(e)
		{
			console.error("Catched", e)
		}
		return []
	}
} 