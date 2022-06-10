import { assertIsDeliverTxSuccess, GasPrice, SigningStargateClient } from "@cosmjs-rn/stargate";
import { FromToAmount } from "core/types/coin/cosmo/FromToAmount";
import { Denom, Operation } from "core/types/coin/Generic";
import { CosmoOperation } from "./CosmoOperation";

export class Send extends CosmoOperation {
	async Run(data: FromToAmount) {
		const wallet = await data.from.Signer()
		const [firstAccount] = await wallet.getAccounts();
		const client = await SigningStargateClient.connectWithSigner(this.coin.RPCEndpoint(), wallet, {
			gasPrice: GasPrice.fromString("0.001ubtsg"),
		})

		try
		{
			const result = await client.sendTokens(firstAccount.address, await data.to.Address(), [data.amount], "auto", data.description);
			assertIsDeliverTxSuccess(result)
				
			return true
		}
		catch(e)
		{
			console.log(e)
		}
		return false
	}
}