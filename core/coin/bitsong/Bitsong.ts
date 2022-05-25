import { Coin } from "core/coin/Generic";
import { CoinOperationEnum } from "core/types/coin/OperationTypes";
import { CosmoCoin } from "../cosmo/CosmoCoin";
import { Balance } from "../cosmo/operations/Balance";
import { Claim } from "../cosmo/operations/Claim";
import { Delegate } from "../cosmo/operations/Delegate";
import { Redelegate } from "../cosmo/operations/Redelegate";
import { Send } from "../cosmo/operations/Send";
import { Undelegate } from "../cosmo/operations/Undelegate";
import { Vote } from "../cosmo/operations/Vote";

export class Bitsong extends CosmoCoin {
	public RPCEndpoint(): string {
		return "https://rpc.testnet.bitsong.network:443/"
	}
	static coin = new Bitsong()
	static operations = {
		[CoinOperationEnum.Send]: new Send(Bitsong.coin),
		[CoinOperationEnum.Balance]: new Balance(Bitsong.coin),
		[CoinOperationEnum.Delegate]: new Delegate(Bitsong.coin),
		[CoinOperationEnum.Undelegate]: new Undelegate(Bitsong.coin),
		[CoinOperationEnum.Redelegate]: new Redelegate(Bitsong.coin),
		[CoinOperationEnum.Vote]: new Vote(Bitsong.coin),
		[CoinOperationEnum.Claim]: new Claim(Bitsong.coin),
	}
}