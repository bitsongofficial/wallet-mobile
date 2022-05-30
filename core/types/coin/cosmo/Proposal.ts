interface ProposalOption {
	index: number,
	description?: string,
}
export interface Proposal {
	id: Long,
	type?: string,
	description?: string,
	options?: ProposalOption[]
}