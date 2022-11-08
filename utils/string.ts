export function capitalize(s: string)
{
	return s.charAt(0).toUpperCase() + s.slice(1)
}

export function rehydrateNewLines(s: string)
{
	return s.split("\\n").join("\n")
}