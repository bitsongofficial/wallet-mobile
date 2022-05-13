import { assertIsBroadcastTxSuccess, SigningStargateClient } from "@cosmjs/stargate";
import { FromToAmount } from "core/types/coin/cosmo/FromToAmount";
import { Operation } from "core/types/coin/Generic";
import { Bitsong } from "../Bitsong";

export class Send implements Operation {
	async Run(data: FromToAmount) {
		const wallet = await data.from.Signer()
		const [firstAccount] = await wallet.getAccounts();
		const client = await SigningStargateClient.connectWithSigner(Bitsong.RPCEndpoint, wallet)

		const result = await client.sendTokens(firstAccount.address, await data.to.Address(), [data.amount], data.description);
		assertIsBroadcastTxSuccess(result)
	}
}