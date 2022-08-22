import { useMemo } from "react"
import { ProposalStatus } from "cosmjs-types/cosmos/gov/v1beta1/gov"

export default function useProposalStatusName(status?: ProposalStatus) {
	return useMemo(() => {
		switch (status) {
			case ProposalStatus.PROPOSAL_STATUS_PASSED:
				return "passed"
			case ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD:
				return "deposit"
			case ProposalStatus.PROPOSAL_STATUS_FAILED:
				return "failed"
			case ProposalStatus.PROPOSAL_STATUS_REJECTED:
				return "rejected"
			case ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD:
				return "voting"
			default:
				return "N/A"
		}
	}, [])
}
