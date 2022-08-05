const billion = 1000000000

export function formatNumber(input: number | string)
{
	const n = (typeof input == "string") ? parseFloat(input) : input

	if(n < 100000) return n.toFixed(4)
	if(n < 10000000) return n.toFixed(2)
	if(n < billion) return n.toFixed(0)
	const billions = n / billion
	let displayedBillions
	if(billions < 1.01)  displayedBillions = billions.toFixed(0)
	else displayedBillions = billions.toFixed(2)
	return displayedBillions + "B"
}