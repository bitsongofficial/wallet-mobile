import { useCallback, useMemo } from "react"
import { ListRenderItem, StyleSheet, View } from "react-native"
import { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { COLOR, hexAlpha, InputHandler } from "utils"
import { Icon2, Paragraph, Title } from "components/atoms"
import { s, vs } from "react-native-size-matters"
import { StyledInput } from "modals/profile/components/atoms"
import { SelectItem } from "../moleculus"
import { observer } from "mobx-react-lite"

export type Props = {
	items: any[]
	onPress?(item: any): void
	active?: any
	activeIndex?: number
	keyExtractor?:((item: any, index: number) => string) | ((item: any) => string)
	labelExtractor?:(item: any) => string
	leftExtractor?:(item: any) => JSX.Element
	rightExtractor?:(item: any) => JSX.Element
	title: string
	description?: string
	searchText?: string
	searchCriteria?:(item:any, search: string) => boolean
}

export default observer((
	{
		title,
		description,
		searchText,
		items,
		onPress,
		active,
		activeIndex,
		searchCriteria,
		keyExtractor = (item, index) => index.toString(),
		labelExtractor,
		leftExtractor,
		rightExtractor,
	}: Props) =>
{
	// --------- Search ---------

	const input = useMemo(() => new InputHandler(), [])

	const filtred = useMemo(() => {
		if (input.value && searchCriteria) {
			return items.filter((item) => searchCriteria(item, input.value))
		} else {
			return items
		}
	}, [input.value, items, searchCriteria])

	const render = useCallback<ListRenderItem<any>>(
		({ item, index }) => (
			<SelectItem
				item={item}
				key={keyExtractor(item, index)}
				isActive={item === active || index === activeIndex}
				onPress={onPress ?? (() => {})}
				labelExtractor={labelExtractor}
				rightExtractor={rightExtractor}
				leftExtractor={leftExtractor}
			/>
		),
		[onPress, active, activeIndex, labelExtractor, rightExtractor, leftExtractor],
	)

	return (
		<View style={styles.container}>
			<Title style={styles.title} title={title} alignment="center" size={20} />
			<Paragraph style={[styles.paragraph, searchCriteria ? styles.mb30 : styles.mb10]}>
				{description}
			</Paragraph>
			{searchCriteria && <StyledInput
				placeholder={searchText ?? "Search"}
				value={input.value}
				onChangeText={input.set}
				style={[styles.search, styles.mb10]}
				Right={
					<View style={styles.iconContainer}>
						<Icon2 name="magnifying_glass" stroke={hexAlpha(COLOR.White, 20)} size={21} />
					</View>
				}
			/>}
			<BottomSheetFlatList
				data={filtred}
				style={styles.scroll}
				contentContainerStyle={styles.scrollContent}
				keyExtractor={keyExtractor}
				renderItem={render}
			/>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		marginTop: vs(15),
		marginHorizontal: s(26),
	},
	title: {
		fontSize: s(16),
		lineHeight: s(20),

		marginBottom: vs(16),
		textAlign: "center",
	},
	paragraph: {
		textAlign: "center",
	},
	search: {
	},
	mb10: {
		marginBottom: vs(9),
	},
	mb30: {
		marginBottom: vs(30),
	},
	scroll: {
		height: vs(100),
		flexGrow: 1,
	},
	scrollContent: {
		paddingTop: vs(9),
		paddingBottom: vs(50),
	},

	//
	iconContainer: {
		paddingHorizontal: s(25),
		alignItems: "center",
		justifyContent: "center",
	},
})
