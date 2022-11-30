import { AminoMsg } from "@cosmjs-rn/amino";
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

type AminoTypesMap<T> = {[k in AminoTypes]?: T}
type ReverseAminoTypesMap<T extends string | number | symbol> = {[k in T]?: AminoTypes}
export const OperationAminoTypesMap: ReverseAminoTypesMap<CoinOperationEnum> = {
	[CoinOperationEnum.Send]: AminoTypes.Send,
	[CoinOperationEnum.Delegate]: AminoTypes.Delegate,
	[CoinOperationEnum.Redelegate]: AminoTypes.Redelegate,
	[CoinOperationEnum.Undelegate]: AminoTypes.Undelegate,
	[CoinOperationEnum.Claim]: AminoTypes.Claim,
	[CoinOperationEnum.Vote]: AminoTypes.Vote,
	[CoinOperationEnum.SubmitProposal]: AminoTypes.SubmitProposal,
	[CoinOperationEnum.Deposit]: AminoTypes.Deposit,
}

export function operationToAminoType(operation: CoinOperationEnum)
{
	return OperationAminoTypesMap[operation]
}

export enum OsmosisAminoTypes {
	SwapExact = "osmosis/gamm/swap-exact-amount-in",
}

const aminoTypesPrettyNames: {
	[k in AminoTypes | string]?: string
} = {
	[AminoTypes.Send]: "Send",
	[OsmosisAminoTypes.SwapExact]: "Swap"
}

const aminoTypesDescriptionKeys: {
	[k in AminoTypes | string]?: string
} = {
	[OsmosisAminoTypes.SwapExact]: "SwapDescription"
}

export function aminoTypePrettyName(aminoType: AminoTypes | string)
{
	return aminoTypesPrettyNames[aminoType] ?? undefined
}

export function getAminoMessageDescriptionKey(msg: AminoMsg)
{
	return aminoTypesDescriptionKeys[msg.type] ?? "GenericType"
}