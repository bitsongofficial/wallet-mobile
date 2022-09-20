import { assertIsDeliverTxSuccess, GasPrice, MsgWithdrawDelegatorRewardEncodeObject, SigningStargateClient } from "@cosmjs-rn/stargate";
import { ClaimData } from "core/types/coin/cosmos/ClaimData";
import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx";
import { CosmosOperation } from "./CosmosOperation";

export class Claim extends CosmosOperation {
	async Run(data: ClaimData) {
		const walletInfos = await Promise.all(
			[
				data.owner.Address(),
				data.owner.Signer(),
			])
		const validatorAddresses = data.validators.map(v => v.operator)
		const wallet = walletInfos[1]
		const ownerAddress = walletInfos[0]
		const client = await SigningStargateClient.connectWithSigner(this.coin.RPCEndpoint(), wallet, {
			gasPrice: GasPrice.fromString(this.coin.gasUnit()),
		})

		const encodedMessages: MsgWithdrawDelegatorRewardEncodeObject[] = validatorAddresses.map(validatorAddresse => ({
			typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
			value: MsgWithdrawDelegatorReward.fromPartial({
				delegatorAddress: ownerAddress,
				validatorAddress: validatorAddresse,
			}),
		}))

		try
		{
			const result = await client.signAndBroadcast(ownerAddress, encodedMessages, "auto")
			assertIsDeliverTxSuccess(result)
			
			return {
				hash: result.transactionHash
			}
		}
		catch(e)
		{
			console.error("Catched", e)
		}
		return false
	}
}