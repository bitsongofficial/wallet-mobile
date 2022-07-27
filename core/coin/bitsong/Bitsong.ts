import axios, { Axios } from "axios"
import { SupportedCoins } from "constants/Coins";
import { Coin } from "core/coin/Generic";
import { Denom } from "core/types/coin/Generic";
import { CoinOperationEnum } from "core/types/coin/OperationTypes";
import Config from "react-native-config";
import { CosmosCoin } from "../cosmos/CosmosCoin";
import { Balance } from "../cosmos/operations/Balance";
import { Claim } from "../cosmos/operations/Claim";
import { Delegate } from "../cosmos/operations/Delegate";
import { Deposit } from "../cosmos/operations/Deposit";
import { Proposals } from "../cosmos/operations/Proposals";
import { Redelegate } from "../cosmos/operations/Redelegate";
import { Rewards } from "../cosmos/operations/Rewards";
import { Send } from "../cosmos/operations/Send";
import { SubmitProposal } from "../cosmos/operations/SubmitProposal";
import { Undelegate } from "../cosmos/operations/Undelegate";
import { Validators } from "../cosmos/operations/Validators";
import { Vote } from "../cosmos/operations/Vote";

export class Bitsong extends CosmosCoin {
	static explorer = axios.create({
		baseURL: "https://lcd.explorebitsong.com/"
	})
	public chain(): SupportedCoins {
		return SupportedCoins.BITSONG
	}
	public denom(): Denom {
		return Denom.UBTSG
	}
	public explorer(): Axios {
		return Bitsong.explorer
	}
	public RPCEndpoint(): string {
		return Config.BITSONG_RPC
	}
	static coin = new Bitsong()
	static operations = {
		[CoinOperationEnum.Balance]: new Balance(Bitsong.coin),
		[CoinOperationEnum.Claim]: new Claim(Bitsong.coin),
		[CoinOperationEnum.Delegate]: new Delegate(Bitsong.coin),
		[CoinOperationEnum.Redelegate]: new Redelegate(Bitsong.coin),
		[CoinOperationEnum.Send]: new Send(Bitsong.coin),
		[CoinOperationEnum.Undelegate]: new Undelegate(Bitsong.coin),
		[CoinOperationEnum.Validators]: new Validators(Bitsong.coin),
		[CoinOperationEnum.Vote]: new Vote(Bitsong.coin),
		[CoinOperationEnum.Proposals]: new Proposals(Bitsong.coin),
		[CoinOperationEnum.Rewards]: new Rewards(Bitsong.coin),
		[CoinOperationEnum.SubmitProposal]: new SubmitProposal(Bitsong.coin),
		[CoinOperationEnum.Deposit]: new Deposit(Bitsong.coin),
	}
}