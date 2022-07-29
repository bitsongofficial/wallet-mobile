import { Proposal } from "core/types/coin/cosmos/Proposal";
import { Reward } from "core/types/coin/cosmos/Rewards";
import { RewardsData } from "core/types/coin/cosmos/RewardsData";
import { Amount } from "core/types/coin/Generic";
import { ProposalStatus } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { CosmosOperation } from "./CosmosOperation";

export class Rewards extends CosmosOperation {
	async Run(data: RewardsData) {
		try
		{
			const service = this.coin.explorer()
			const address = await data.wallet.Address()
			const extraParams = data.validator ? ("/" + data.validator.operator) : ""
			const rawRewards = (await service.get(`/cosmos/distribution/v1beta1/delegators/${address}/rewards${extraParams}`)).data.rewards
			const rewards = rawRewards.map((r:any):Reward =>
				(data.validator ? {
					debtor: r.data.validator,
					rewards: r as Amount[],
				}
				:
				{
					debtor: r.validator_address,
					rewards: r.reward as Amount[],
				}))
			return rewards
		}
		catch(e)
		{
			console.error("Catched", e)
		}
		return []
	}
} 