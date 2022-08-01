import { SupportedCoins } from "constants/Coins"

export enum ValidatorStatusRequest {
	BOND_STATUS_BONDED = 'BOND_STATUS_BONDED',
	BOND_STATUS_UNBONDING = 'BOND_STATUS_UNBONDING',
	BOND_STATUS_UNBONDED = 'BOND_STATUS_UNBONDED',
	BOND_STATUS_UNSPECIFIED = 'BOND_STATUS_UNSPECIFIED'
}

export enum ValidatorStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export interface DetailedValidatorStatus {
	status: ValidatorStatus,
	statusDetailed: string,
}

export interface SignerInfo {
	address: string;
	start_height: string;
	index_offset: string;
	jailed_until: string;
	tombstoned: boolean;
	missed_blocks_counter: string;
}

export interface Validator {
	id: string,
	identity: string,
	name: string,
	logo: string,
	description: string,
	status: DetailedValidatorStatus,
	commission: {
		rate: {
			max: number,
			current: number,
		},
		change: {
			max: number,
			last: Date,
		}
	},
	userClaimAmount: number,
	userDelegation: number,
	operator: string,
	tokens: number,
	// uptime: number,
	chain?: SupportedCoins,
	signingInfo?: SignerInfo,
}