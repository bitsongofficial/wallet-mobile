import { useCallback } from "react"
import { ListRenderItem } from "react-native"
import { SelectItem, SelectItemProps } from "../moleculus"
import SelectBase, { Props as SelectProps } from "./SelectBase"

export type Props<T> =  {
	active?: T
	activeIndex?: number
} & Omit<SelectProps<T>, "renderFunction"> &
	Omit<SelectItemProps<T>, "isActive" | "item">

export default function Select<T>(
	{
		active,
		activeIndex,
		hideSelector = false,
		labelExtractor,
		leftExtractor,
		rightExtractor,
		...props
	}: Props<T>)
{
	const render = useCallback<ListRenderItem<any>>(
		({ item, index }) => (
			<SelectItem
				item={item}
				isActive={item === active || index === activeIndex}
				hideSelector={hideSelector}
				labelExtractor={labelExtractor}
				rightExtractor={rightExtractor}
				leftExtractor={leftExtractor}
			/>
		),
		[active, activeIndex, labelExtractor, rightExtractor, leftExtractor],
	)

	return (
		<SelectBase
			renderFunction={render}
			{...props}
		/>
	)
}