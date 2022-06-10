import { StargateClient } from "@cosmjs-rn/stargate";
import { BalanceData } from "core/types/coin/cosmo/BalanceData";
import { Denom } from "core/types/coin/Generic";
import { CosmoOperation } from "./CosmoOperation";

export class Balance extends CosmoOperation {
	async Run(data: BalanceData) {
		const client = await StargateClient.connect(this.coin.RPCEndpoint())
		const result = await client.getBalance(await data.wallet.Address(), Denom.UBTSG);
		return result
	}
}