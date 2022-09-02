import { Keyboard } from "react-native"
import { BottomSheetProps } from "@gorhom/bottom-sheet"
import { gbs, globalLoading } from "modals"
import {
	AddWatchAccount,
	ControllerAddWatchAccount,
	FooterAddWatchAccount,
} from "./components/organisms"
import { store } from "stores/Store"

type Options = {
	props?: Omit<Partial<BottomSheetProps>, "onClose" | " children">
	onClose?(): void
}

export default async function openChangeAvatar({ props, onClose }: Options) {
	const close = () => {
		Keyboard.dismiss()
		gbs.close()
	}

	const controller = new ControllerAddWatchAccount()
	const { steps, inputName, inputWallet } = controller
	const { wallet } = store

	const goBack = () => (steps.history.length > 1 ? steps.goBack() : close())

	const save = async () => {
		globalLoading.open()
		await wallet.newWatchWallet(inputName.value, inputWallet.value)
		globalLoading.close()
		close()
	}

	const open = async () => {
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
			children: () => <AddWatchAccount controller={controller} />,
			footerComponent: () => <FooterAddWatchAccount controller={controller} onPressSave={save} />,
		})

		requestAnimationFrame(() => gbs.expand())
	}

	open()
}
