import { assertIsDeliverTxSuccess, GasPrice, SigningStargateClient } from "@cosmjs-rn/stargate";
import { RedelegateData } from "core/types/coin/cosmos/RedelegateData";
import { MsgBeginRedelegate } from "cosmjs-types/cosmos/staking/v1beta1/tx";
import { CosmosOperation } from "./CosmosOperation";

export class Redelegate extends CosmosOperation {
	async Run(data: RedelegateData) {
		const walletInfos = await Promise.all(
			[
				data.delegator.Address(),
				data.delegator.Signer(),
				data.validator.Address(),
				data.newValidator.Address(),
			])
		const wallet = walletInfos[1]
		const client = await SigningStargateClient.connectWithSigner(this.coin.RPCEndpoint(), wallet, {
			gasPrice: GasPrice.fromString("0.001ubtsg"),
		})

		const encodedMessage = {
			typeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
			value: MsgBeginRedelegate.fromPartial({
				delegatorAddress: walletInfos[0],
				validatorSrcAddress: walletInfos[2],
				validatorDstAddress: walletInfos[3],
				amount: data.amount,
			}),
		  }

		try
		{
			const result = await client.signAndBroadcast(walletInfos[0], [encodedMessage], "auto")
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