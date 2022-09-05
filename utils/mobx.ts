import { has as hasMobX } from "mobx"
export function has(obj: any, key: string)
{
	try
	{
		return hasMobX(obj, key)
	}
	catch
	{
		return (key in obj)
	}
}