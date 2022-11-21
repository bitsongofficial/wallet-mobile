export function fromObjectToMap<T extends any>(obj: any)
{
	const m = new Map<string, T>()
	Object.keys(obj).forEach(k => m.set(k, obj[k]))
	return m
}

export function mergeMaps<K extends any, T extends any>(map1: Map<K, T>, map2: Map<K, T>)
{
	return new Map<K, T>([...map1, ...map2])
}