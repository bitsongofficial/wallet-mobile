import { getPrefixFromAddress, separateAddress } from "core/utils/Address"

export function trimAddress(address: string, lengthWithoutPrefix = 13)
{
	if(address)
	{
		const prefix = getPrefixFromAddress(address)
		const dataAsString = address.substring(prefix.length)
		if(dataAsString.length < lengthWithoutPrefix) return address
		const l = lengthWithoutPrefix - 3
		const low = Math.ceil(l/2)
		const high = Math.floor(l/2)
		return prefix + dataAsString.substring(0,low) + "..." + dataAsString.substring(dataAsString.length-high)
	}
	return "Missing address"
}