export function escapeHTML(str: string)
{
	return str.replace(/(<([^>]+)>)/ig, '')
}