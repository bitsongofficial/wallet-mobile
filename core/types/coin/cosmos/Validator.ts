import { SupportedCoins } from "constants/Coins"

export enum ValidatorStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export interface DetailedValidatorStatus {
	status: ValidatorStatus,
	statusDetailed: string,
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
}