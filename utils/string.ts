export function trimAddress(address: string)
{
	if(address)
	return address.substring(0,15) + "..." + address.substring(address.length-6,address.length-1)
	return "Missing address"
}