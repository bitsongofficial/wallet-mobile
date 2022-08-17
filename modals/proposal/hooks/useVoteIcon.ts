import { useMemo } from "react"
import { IconName } from "components/atoms"

export default function useVoteIcon(
	value: "yes" | "no" | "no with veto" | "abstain",
	isActive: boolean,
) {
	return useMemo((): IconName => {
		switch (value) {
			case "yes":
				return isActive ? "CheckCircle_gradient" : "check_fulfilled"
			case "no":
				return isActive ? "XCircle_gradient" : "XCircle"
			case "no with veto":
				return isActive ? "ProhibitInset_gradient" : "ProhibitInset"
			case "abstain":
				return isActive ? "MinusCircle_gradient" : "MinusCircle"
		}
	}, [value, isActive])
}
