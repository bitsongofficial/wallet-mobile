import { Coin } from "core/coin/Generic";
import { CoinOperationEnum } from "core/types/coin/OperationTypes";
import { Balance } from "./operations/Balance";
import { Send } from "./operations/Send";

export class Bitsong extends Coin{
	public static RPCEndpoint = "https://rpc.testnet.bitsong.network:443/"
	operations = {
		// [CoinOperationEnum.Send]: new Send(),
		[CoinOperationEnum.Balance]: new Balance()
	}
}