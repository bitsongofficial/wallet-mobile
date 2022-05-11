enum OperationTypeEnum {}

enum CoinOperationEnum {
	Send,
	Delegate,
	Undelegate,
	Redelegate,
	Claim,
	Balance,
	Vote,
	History,
}

export type CoinOperation = OperationTypeEnum | CoinOperationEnum

enum FanTokenOperationEnum {
	Issue,
	Mint,
	Burn,
	DisableMint,
	TransferOwnership,
}

export type FanTokenOperation = OperationTypeEnum | FanTokenOperationEnum