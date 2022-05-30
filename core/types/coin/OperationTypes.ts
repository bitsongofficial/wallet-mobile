enum OperationTypeEnum {}

export enum CoinOperationEnum {
	Send = 'SEND',
	Delegate = 'DELEGATE',
	Undelegate = 'UNDELEGATE',
	Redelegate = 'REDELEGATE',
	Claim = 'CLAIM',
	Balance = 'BALANCE',
	Vote = 'VOTE',
	History = 'HISTORY',
}

export type CoinOperation = OperationTypeEnum | CoinOperationEnum

export enum FanTokenOperationEnum {
	Issue = 'ISSUE',
	Mint = 'MINT',
	Burn = 'BURN',
	DisableMint = 'DISABLE_MINT',
	TransferOwnership = 'TRANSFER_OWNERSHIP',
}

export type FanTokenOperation = OperationTypeEnum | FanTokenOperationEnum