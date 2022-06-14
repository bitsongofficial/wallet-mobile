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
			const rawRewards = (await service.get(`/cosmos/distribution/v1beta1/delegators/${address}/rewards`)).data.rewards
			const rewards = rawRewards.map((r:any):Reward =>
				({
					debtor: r.validator_address,
					rewards: r.reward as Amount[],
				}))
			return rewards
		}
		catch(e)
		{
			console.log(e)
		}
		return []
	}
} 