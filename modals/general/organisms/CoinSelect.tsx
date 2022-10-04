import { useCallback } from "react"
import { ListRenderItem, StyleSheet } from "react-native"
import SelectBase, { Props as SelectProps } from "./SelectBase"
import { Coin } from "classes"
import { CoinStat } from "components/organisms"

export type Props = Omit<SelectProps, "title" | "description" | "renderFunction" | "items"> & {
	active?: Coin
	activeIndex?: number
	hideSelector?: boolean
	coins: Coin[]
}

export default (
	{
		active,
		activeIndex,
		coins,
		...props
	}: Props) =>
{
	const render = useCallback<ListRenderItem<Coin>>(
		({ item, index }) =>
		(
			<CoinStat coin={item} />
		),
		[active, activeIndex],
	)

	return (
		<SelectBase
			{...props}
			title="Select coin"
			description={"Select also the chain where your coin\ncome from"}
			items={coins}
			renderFunction = {render}
		/>
	)
}

const styles = StyleSheet.create({
	activeItem: {

	}
})