import axios, { Axios } from "axios"
import { SupportedCoins } from "constants/Coins";
import { Denom } from "core/types/coin/Generic";
import { CoinOperationEnum, OperationMap } from "core/types/coin/OperationTypes";
import Config from "react-native-config";
import { CosmosCoin } from "../cosmos/CosmosCoin";
import { Balance } from "../cosmos/operations/Balance";
import { Claim } from "../cosmos/operations/Claim";
import { Delegate } from "../cosmos/operations/Delegate";
import { Delegations } from "../cosmos/operations/Delegations";
import { Deposit } from "../cosmos/operations/Deposit";
import { Proposals } from "../cosmos/operations/Proposals";
import { Redelegate } from "../cosmos/operations/Redelegate";
import { Rewards } from "../cosmos/operations/Rewards";
import { Send } from "../cosmos/operations/Send";
import { SendIbc } from "../cosmos/operations/SendIbc";
import { SubmitProposal } from "../cosmos/operations/SubmitProposal";
import { Undelegate } from "../cosmos/operations/Undelegate";
import { Validators } from "../cosmos/operations/Validators";
import { Vote } from "../cosmos/operations/Vote";

export class OsmosisTestnet extends CosmosCoin {
	private innerExplorer = axios.create({
		baseURL: Config.OSMOSIS_TESTNET_EXPLORER
	})
	public chain(): SupportedCoins {
		return SupportedCoins.OSMOSIS_TESTNET
	}
	public denom(): Denom {
		return Denom.UOSMO
	}
	public explorer(): Axios {
		return this.innerExplorer
	}
	public RPCEndpoint(): string {
		return Config.OSMOSIS_TESTNET_RPC ?? ""
	}
	operations: OperationMap = {
		[CoinOperationEnum.Balance]: new Balance(this),
		[CoinOperationEnum.Claim]: new Claim(this),
		[CoinOperationEnum.Delegations]: new Delegations(this),
		[CoinOperationEnum.Delegate]: new Delegate(this),
		[CoinOperationEnum.Redelegate]: new Redelegate(this),
		[CoinOperationEnum.Send]: new Send(this),
		[CoinOperationEnum.SendIbc]: new SendIbc(this),
		[CoinOperationEnum.Undelegate]: new Undelegate(this),
		[CoinOperationEnum.Validators]: new Validators(this),
		[CoinOperationEnum.Vote]: new Vote(this),
		[CoinOperationEnum.Proposals]: new Proposals(this),
		[CoinOperationEnum.Rewards]: new Rewards(this),
		[CoinOperationEnum.SubmitProposal]: new SubmitProposal(this),
		[CoinOperationEnum.Deposit]: new Deposit(this),
	}
}