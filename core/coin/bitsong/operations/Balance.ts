import { QueryClient, setupBankExtension } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { BalanceData } from "core/types/coin/cosmo/BalanceData";
import { Denom, Operation } from "core/types/coin/Generic";
import { Bitsong } from "../Bitsong";

export class Balance implements Operation {
	async Run(data: BalanceData) {
		const client = await Tendermint34Client.connect(Bitsong.RPCEndpoint)
		const qc = QueryClient.withExtensions(client, setupBankExtension);
		const result = qc.bank.balance(await data.wallet.Address(), Denom.BTSGN)
		// const client = await StargateClient.connect(Bitsong.RPCEndpoint)
		// const result = await client.getBalance(await data.wallet.Address(), Denom.BTSGN);
		return result
	}
}