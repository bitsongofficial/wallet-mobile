export function fromObjectToMap<T extends any>(obj: any)
{
	const m = new Map<string, T>()
	Object.keys(obj).forEach(k => m.set(k, obj[k]))
}