import { CoinOperationEnum } from "core/types/coin/OperationTypes";

export enum AminoTypes {
	Send = "/cosmos.bank.v1beta1.MsgSend",
	Delegate = "/cosmos.staking.v1beta1.MsgDelegate",
	Undelegate = "/cosmos.staking.v1beta1.MsgUndelegate",
	Redelegate = "/cosmos.staking.v1beta1.MsgBeginRedelegate",
	Claim = "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
	Vote = "/cosmos.gov.v1beta1.MsgVote",
	SubmitProposal = "/cosmos.gov.v1beta1.MsgSubmitProposal",
	Deposit = "/cosmos.gov.v1beta1.MsgDeposit",
}
export const OperationAminoTypesMap: {[k in CoinOperationEnum]?: AminoTypes | string} = {
	[CoinOperationEnum.Send]: AminoTypes.Send,
	[CoinOperationEnum.Delegate]: AminoTypes.Delegate,
	[CoinOperationEnum.Redelegate]: AminoTypes.Redelegate,
	[CoinOperationEnum.Undelegate]: AminoTypes.Undelegate,
	[CoinOperationEnum.Claim]: AminoTypes.Claim,
	[CoinOperationEnum.Vote]: AminoTypes.Vote,
	[CoinOperationEnum.SubmitProposal]: AminoTypes.SubmitProposal,
	[CoinOperationEnum.Deposit]: AminoTypes.Deposit,
	[CoinOperationEnum.Balance]: "",
	[CoinOperationEnum.Validators]: "",
	[CoinOperationEnum.History]: "",
	[CoinOperationEnum.Proposals]: "",
	[CoinOperationEnum.Rewards]: "",
}

export function operationToAminoType(operation: CoinOperationEnum)
{
	return OperationAminoTypesMap[operation]
}

const aminoTypesPrettyNames: {
	[k in AminoTypes | string]?: string
} = {
	[AminoTypes.Send]: "Send",
}
export function aminoTypePrettyName(aminoType: AminoTypes | string)
{
	return aminoTypesPrettyNames[aminoType] ?? undefined
}