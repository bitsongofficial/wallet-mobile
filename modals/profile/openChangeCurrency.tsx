import { Keyboard } from "react-native"
import { BottomSheetProps } from "@gorhom/bottom-sheet"
import { gbs } from "modals"
import { ChangeCurrency } from "./components/organisms"

type Options = {
	props?: Omit<Partial<BottomSheetProps>, "onClose" | " children">
	onClose?(): void
}

export default async function openChangeAvatar({ props, onClose }: Options) {
	const close = () => {
		Keyboard.dismiss()
		gbs.close()
	}

	gbs.backHandler = () => close()

	await gbs.setProps({
		snapPoints: ["95%"],
		...props,
		onChange(index) {
			if (index === -1) {
				gbs.removeBackHandler()
				onClose && onClose()
			}
		},
		children: () => <ChangeCurrency close={close} />,
	})
	requestAnimationFrame(() => gbs.expand())
}
