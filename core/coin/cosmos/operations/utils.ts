import { CoinOperationEnum } from "core/types/coin/OperationTypes";

export const AminoTypes: {[k in CoinOperationEnum]?: string} = {
	[CoinOperationEnum.Send]: "/cosmos.bank.v1beta1.MsgSend",
	[CoinOperationEnum.Delegate]: "/cosmos.staking.v1beta1.MsgDelegate",
	[CoinOperationEnum.Redelegate]: "/cosmos.staking.v1beta1.MsgBeginRedelegate",
	[CoinOperationEnum.Undelegate]: "/cosmos.staking.v1beta1.MsgUndelegate",
	[CoinOperationEnum.Claim]: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
	[CoinOperationEnum.Vote]: "/cosmos.gov.v1beta1.MsgVote",
	[CoinOperationEnum.SubmitProposal]: "/cosmos.gov.v1beta1.MsgSubmitProposal",
	[CoinOperationEnum.Deposit]: "/cosmos.gov.v1beta1.MsgDeposit",
	[CoinOperationEnum.Balance]: "",
	[CoinOperationEnum.Validators]: "",
	[CoinOperationEnum.History]: "",
	[CoinOperationEnum.Proposals]: "",
	[CoinOperationEnum.Rewards]: "",
}

export function operationToAminoType(operation: CoinOperationEnum)
{
	return AminoTypes[operation]
}