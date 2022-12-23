import { Keyboard, StyleSheet } from "react-native"
import { BottomSheetProps, BottomSheetView } from "@gorhom/bottom-sheet"
import { gbs } from "modals"
import { default as Select, Props as SelectProps } from "./organisms/Select"
import HorizontalWrapper from "screens/layout/HorizontalWrapper"
import { s } from "react-native-size-matters"

type Props = {
	onClose?(): void
	onDismiss?(): void
	onSelect?(item: any): void
}

export default async function openSelect<T>(
	{
		onClose,
		onDismiss,
		onSelect,
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
		snapPoints,
		...props
	}: Props & SelectProps<T> & Omit<BottomSheetProps, "children">) {
	const status = { done: false }
	const close = () => {
		Keyboard.dismiss()
		gbs.close()
	}

	gbs.backHandler = () => close()

	const select = (item: any) =>
	{
		status.done = true
		onSelect && onSelect(item)
		close()
	}

	await gbs.setProps({
		snapPoints: snapPoints ?? ["95%"],
		...props,
		onChange(index) {
			if (index === -1) {
				gbs.removeBackHandler()
				onClose && onClose()
				onDismiss && !status.done && onDismiss()
			}
		},
		children: () =>
		<BottomSheetView style={[styles.container, styles.minFullHeight]}>
			<HorizontalWrapper style={styles.minFullHeight}>
				<Select
					title={title}
					description={description}
					searchText={searchText}
					items={items}
					onPress={select}
					active={active}
					activeIndex={activeIndex}
					searchCriteria={searchCriteria}
					keyExtractor={keyExtractor}
					labelExtractor={labelExtractor}
					leftExtractor={leftExtractor}
					rightExtractor={rightExtractor}
				/>
			</HorizontalWrapper>
		</BottomSheetView>,
	})
	requestAnimationFrame(() => gbs.expand())
}

const styles = StyleSheet.create({
	container: {
		paddingBottom: s(8),
	},
	minFullHeight: {
		minHeight: "100%",
	},
})