import { StargateClient } from "@cosmjs/stargate";
import { BalanceData } from "core/types/coin/cosmos/BalanceData";
import { Denom } from "core/types/coin/Generic";
import { CosmosOperation } from "./CosmosOperation";

export class Balance extends CosmosOperation {
	async Run(data: BalanceData) {
		const client = await StargateClient.connect(this.coin.RPCEndpoint())
		// const result = await client.getBalance(await data.wallet.Address(), Denom.UBTSG);
		const result = await client.getAllBalances(await data.wallet.Address())
		return result
	}
}