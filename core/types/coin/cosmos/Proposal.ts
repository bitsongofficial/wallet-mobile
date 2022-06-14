import { ProposalStatus } from "cosmjs-types/cosmos/gov/v1beta1/gov";

export enum ProposalType {
	SOFTWARE_UPGRADE = 'SOFTWARE_UPGRADE',
	TEXT = 'TEXT',
	PARAMETER_CHANGE = 'PARAMETER_CHANGE',
	TREASURY = 'TREASURY',
	UNSUPPORTED = 'UNSUPPORTED'
}

export interface Proposal {
	id: Long,
	type?: ProposalType,
	title?: string,
	description?: string,
	status?: ProposalStatus,
	voting?: {
		start?: Date,
		end?: Date,
		options?: ProposalOption[],
	},
	result?: {
		yes: number,
		abstain: number,
		no: number,
        noWithZero: number,
	},
	submit?: Date,
	deposit?: Date,
}

interface ProposalOption {
	index: number,
	description?: string,
}