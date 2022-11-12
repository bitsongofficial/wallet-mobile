import { Bech32 } from "@cosmjs-rn/encoding"

export function trimAddress(address: string, lengthWithoutPrefix = 13)
{
	if(address)
	{
		try
		{
			const prefix = getPrefixFromAddress(address) ?? ""
			const dataAsString = address.substring(prefix.length)
			if(dataAsString.length < lengthWithoutPrefix) return address
			const l = lengthWithoutPrefix - 3
			const low = Math.ceil(l/2)
			const high = Math.floor(l/2)
			return prefix + dataAsString.substring(0,low) + "..." + dataAsString.substring(dataAsString.length-high)
		}
		catch
		{
			return "Invalid address"
		}
	}
	return "Missing address"
}

export function isValidAddress(address: string, requiredPrefix?: string): boolean
{
	try {
	  	const { prefix, data } = Bech32.decode(address);
  
	  	if (requiredPrefix && prefix !== requiredPrefix) {
			return false;
	  	}
  
	  	return data.length === 20;
	}
	catch
	{
	  	return false;
	}
}

export function separateAddress(address: string)
{
	return Bech32.decode(address)
}

export function getPrefixFromAddress(address: string)
{
	try
	{
		return Bech32.decode(address).prefix
	}
	catch
	{
		return undefined
	}
}