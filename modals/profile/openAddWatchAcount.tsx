import { BottomSheetProps } from "@gorhom/bottom-sheet"
import { Steps } from "classes"
import { gbs } from "modals"
import { Keyboard } from "react-native"
import { AddWatchAccount } from "./components/organisms"

type Options = {
	props?: Omit<Partial<BottomSheetProps>, "onClose" | " children">
	onClose?(): void
}

export default async function openChangeAvatar({ props, onClose }: Options) {
	const close = () => {
		Keyboard.dismiss()
		gbs.close()
	}
	const steps = new Steps(["Add", "Name"])
	const goBack = () => (steps.history.length > 1 ? steps.goBack() : close())

	gbs.backHandler = () => goBack()

	await gbs.setProps({
		snapPoints: [350],
		...props,
		onChange(index) {
			if (index === -1) {
				gbs.removeBackHandler()
				onClose && onClose()
			}
		},
		children: () => <AddWatchAccount close={close} steps={steps} />,
	})
	requestAnimationFrame(() => gbs.expand())
}
