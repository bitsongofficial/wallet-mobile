import { useCallback } from "react"
import { ListRenderItem, StyleSheet } from "react-native"
import ListItem, { Props as ListItemProps } from "components/moleculs/ListItem"
import SelectBase, { Props as SelectProps } from "./SelectBase"

export type Props<T> = Omit<SelectProps<T>, "renderFunction"> & {
	active?: T
	activeIndex?: number
	hideSelector?: boolean
	infoExtractor(item: T): Omit<ListItemProps, "style">
}

export default function DetailedSelect<T> (
	{
		active,
		activeIndex,
		infoExtractor,
		...props
	}: Props<T>)
{
	const render = useCallback<ListRenderItem<T>>(
		({ item, index }) =>
		{
			const infos = infoExtractor(item)
			return (
				<ListItem
					style={item === active || index === activeIndex ? styles.activeItem : undefined}
					title={infos.title}
					subtitle={infos.subtitle}
					uri={infos.uri}
					description={infos.description}
					subdescription={infos.subdescription}
				/>
			)
		},
		[active, activeIndex, infoExtractor],
	)

	return (
		<SelectBase
			{...props}
			renderFunction = {render}
		/>
	)
}

const styles = StyleSheet.create({
	activeItem: {

	}
})