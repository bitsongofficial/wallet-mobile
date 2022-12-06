export function fromObjectToMap<T extends any>(obj: any)
{
	const m = new Map<string, T>()
	Object.keys(obj).forEach(k => m.set(k, obj[k]))
	return m
}

export function mergeMaps<K extends any, T extends any>(...maps: Map<K, T>[])
{
	const elements: any[] = []
	maps.forEach(m =>
		{
			elements.push(...m)
		})
	return new Map<K, T>(elements)
}