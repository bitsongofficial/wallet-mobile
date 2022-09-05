import { useCallback, useState } from "react"

export default function useToggle(value = false) {
	const [state, setState] = useState(value)
	const toggle = useCallback(() => setState((v) => !v), [])

	return [state, toggle] as const
}
