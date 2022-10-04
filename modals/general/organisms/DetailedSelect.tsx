import { useCallback } from "react"
import { ListRenderItem, StyleSheet } from "react-native"
import ListItem, { Props as ListItemProps } from "components/moleculs/ListItem"
import SelectBase, { Props as SelectProps } from "./SelectBase"

export type Props = Omit<SelectProps, "renderFunction"> & {
	active?: any
	activeIndex?: number
	hideSelector?: boolean
	infoExtractor(item: any): Omit<ListItemProps, "style">
}

export default (
	{
		active,
		activeIndex,
		infoExtractor,
		...props
	}: Props) =>
{
	const render = useCallback<ListRenderItem<any>>(
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