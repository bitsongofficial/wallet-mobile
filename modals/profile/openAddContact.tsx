import { Keyboard } from "react-native"
import { BottomSheetProps } from "@gorhom/bottom-sheet"
import { gbs } from "modals"
import { navigationRef } from "navigation/utils"
import { Steps } from "classes"
import { InputHandler } from "utils"
import { AddContact } from "./components/organisms"

type Options = {
	props?: Omit<Partial<BottomSheetProps>, "onClose" | " children">
	onClose?(): void
}

export default async function openChangeAvatar({ props, onClose }: Options) {
	const close = () => {
		Keyboard.dismiss()
		gbs.close()
	}

	const steps = new Steps(["Add", "Name", "Avatar"])
	const inputWallet = new InputHandler()
	const inputName = new InputHandler()

	const goBack = () => (steps.history.length > 1 ? steps.goBack() : close())

	const setBackHandler = () => {
		gbs.backHandler = () => goBack()
	}

	const scan = () => {
		close()
		navigationRef.current?.navigate("ScannerQR", {
			onBarCodeScanned: inputWallet.set,
			onClose: open,
		})
	}

	const children = () => (
		<AddContact
			inputWallet={inputWallet}
			inputName={inputName}
			onPressScan={scan}
			close={close}
			steps={steps}
			onPressBack={goBack}
		/>
	)

	const open = () => {
		setBackHandler()
		gbs.setProps({
			snapPoints: [350],
			...props,
			onChange(index) {
				if (index === -1) {
					gbs.removeBackHandler()
					onClose && onClose()
				}
			},
			children,
		})
		requestAnimationFrame(() => gbs.expand())
	}

	open()
}
