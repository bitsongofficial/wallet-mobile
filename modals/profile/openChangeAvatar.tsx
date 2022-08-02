import { Keyboard } from "react-native"
import { BottomSheetProps } from "@gorhom/bottom-sheet"
import { gbs } from "modals"
import { ChangeAvatar } from "./components/organisms"

type Options = {
	props?: Omit<Partial<BottomSheetProps>, "onClose" | " children">
	onClose?(): void
}

export default async function openChangeAvatar({ props, onClose }: Options) {
	const close = () => {
		Keyboard.dismiss()
		gbs.close()
	}

	await gbs.setProps({
		snapPoints: [350],
		android_keyboardInputMode: undefined,
		...props,
		onChange(index) {
			if (index === -1) {
				gbs.removeBackHandler()
				onClose && onClose()
			}
		},
		children: () => <ChangeAvatar close={close} />,
	})
	requestAnimationFrame(() => gbs.expand())
}
