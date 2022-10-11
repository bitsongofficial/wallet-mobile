import { Keyboard } from "react-native"
import { BottomSheetProps } from "@gorhom/bottom-sheet"
import { gbs } from "modals"
import { default as Select, Props as SelectProps } from "./organisms/Select"

type Props = {
	onClose?(): void
	onDismiss?(): void
	onSelect?(item: any): void
}

export default async function openSelect(
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
	}: Props & SelectProps & BottomSheetProps) {
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
		children: () => <Select
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
		/>,
	})
	requestAnimationFrame(() => gbs.expand())
}
