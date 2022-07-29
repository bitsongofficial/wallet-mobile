import { assertIsDeliverTxSuccess, GasPrice, MsgWithdrawDelegatorRewardEncodeObject, SigningStargateClient } from "@cosmjs-rn/stargate";
import { ClaimData } from "core/types/coin/cosmos/ClaimData";
import { MsgWithdrawDelegatorReward } from "cosmjs-types/cosmos/distribution/v1beta1/tx";
import { CosmosOperation } from "./CosmosOperation";

export class Claim extends CosmosOperation {
	async Run(data: ClaimData) {
		const walletInfos = Promise.all(
			[
				data.owner.Address(),
				data.owner.Signer(),
			])
		const validators = Promise.all(data.validators.map(v => v.operator))
		const transactionData = await Promise.all([walletInfos, validators])
		const wallet = transactionData[0][1]
		const ownerAddress = transactionData[0][0]
		const validatorAddresses = transactionData[1]
		const client = await SigningStargateClient.connectWithSigner(this.coin.RPCEndpoint(), wallet, {
			gasPrice: GasPrice.fromString("0.001ubtsg"),
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
			
			return true
		}
		catch(e)
		{
			console.error("Catched", e)
		}
		return false
	}
}