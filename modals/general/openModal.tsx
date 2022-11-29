import { InteractionManager, Keyboard } from "react-native"
import { BottomSheetProps } from "@gorhom/bottom-sheet"
import { gbs } from "modals"
import { ReactNode } from "react"

type Props = {
	children: ReactNode
}

export default async function openModal(
	{
		children,
		snapPoints,
		...props
	}: Props & Partial<BottomSheetProps>) {
	const close = () => {
		Keyboard.dismiss()
		gbs.close()
	}

	gbs.backHandler = () => close()
	InteractionManager.runAfterInteractions(() => {
		gbs.setProps({
			onChange(index) {
				if (index === -1) {
					gbs.removeBackHandler()
				}
			},
			snapPoints: snapPoints ?? ["60%"],
			...props,
			children,
		})

		gbs.expand()
	})
}
