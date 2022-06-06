import { SupportedCoins } from "constants/Coins";
import { Coin } from "core/coin/Generic";
import { Denom } from "core/types/coin/Generic";
import { CoinOperationEnum } from "core/types/coin/OperationTypes";
import { CosmosCoin } from "../cosmos/CosmosCoin";
import { Balance } from "../cosmos/operations/Balance";
import { Claim } from "../cosmos/operations/Claim";
import { Delegate } from "../cosmos/operations/Delegate";
import { Redelegate } from "../cosmos/operations/Redelegate";
import { Send } from "../cosmos/operations/Send";
import { Undelegate } from "../cosmos/operations/Undelegate";
import { Vote } from "../cosmos/operations/Vote";

export class Bitsong extends CosmosCoin {
	public denom(): Denom {
		return Denom.UBTSG
	}
	public chain(): SupportedCoins {
		return SupportedCoins.BITSONG
	}
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