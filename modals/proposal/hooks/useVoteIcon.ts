import { useMemo } from "react"
import { IconName } from "components/atoms"
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov"

export default function useVoteIcon(
	value: VoteOption,
	isActive: boolean,
) {
	return useMemo((): IconName => {
		switch (value) {
			case VoteOption.VOTE_OPTION_YES:
				return isActive ? "CheckCircle_gradient" : "check_fulfilled"
			case VoteOption.VOTE_OPTION_NO:
				return isActive ? "XCircle_gradient" : "XCircle"
			case VoteOption.VOTE_OPTION_NO_WITH_VETO:
				return isActive ? "ProhibitInset_gradient" : "ProhibitInset"
			case VoteOption.VOTE_OPTION_ABSTAIN:
				return isActive ? "MinusCircle_gradient" : "MinusCircle"
			default:
				return isActive ? "CheckCircle_gradient" : "check_fulfilled"
		}
	}, [value, isActive])
}
