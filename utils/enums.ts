export function enumValues(e: Object)
{
	return Object.entries(e).filter(entry => Number.isNaN(parseInt(entry[0]))).map(entry => entry[1])
}