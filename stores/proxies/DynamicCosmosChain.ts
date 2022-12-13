import { Axios } from "axios";
import { SupportedCoins } from "constants/Coins";
import { CosmosCoin } from "core/coin/cosmos/CosmosCoin";
import { Balance } from "core/coin/cosmos/operations/Balance";
import { Claim } from "core/coin/cosmos/operations/Claim";
import { Delegate } from "core/coin/cosmos/operations/Delegate";
import { Delegations } from "core/coin/cosmos/operations/Delegations";
import { Deposit } from "core/coin/cosmos/operations/Deposit";
import { Proposals } from "core/coin/cosmos/operations/Proposals";
import { Redelegate } from "core/coin/cosmos/operations/Redelegate";
import { Rewards } from "core/coin/cosmos/operations/Rewards";
import { Send } from "core/coin/cosmos/operations/Send";
import { SendIbc } from "core/coin/cosmos/operations/SendIbc";
import { SubmitProposal } from "core/coin/cosmos/operations/SubmitProposal";
import { Undelegate } from "core/coin/cosmos/operations/Undelegate";
import { Validators } from "core/coin/cosmos/operations/Validators";
import { Vote } from "core/coin/cosmos/operations/Vote";
import { ChainIndex } from "core/types/coin/Coin";
import { Denom } from "core/types/coin/Generic";
import { CoinOperationEnum, OperationMap } from "core/types/coin/OperationTypes";
import { Chain } from "stores/models/Chain";

export class DynamicCosmosChain extends CosmosCoin {
	constructor(private innerChain: Chain)
	{
		super()
	}
	public chain(): ChainIndex {
		return this.innerChain.name
	}
	public denom(): Denom | string {
		return this.innerChain.defaultDenom
	}
	public apiEndpoint(): string {
		return this.innerChain.api
	}
	public RPCEndpoint(): string {
		return this.innerChain.rpc
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