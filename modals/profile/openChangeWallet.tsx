import { BottomSheetProps } from "@gorhom/bottom-sheet"
import { gbs } from "modals"
import { Keyboard } from "react-native"
import { store } from "stores/Store"
import { ChangeWallet, FooterChangeWallet } from "./components/organisms"
import { ControllerChangeWallet } from "./controllers"

type Options = {
	props?: Omit<Partial<BottomSheetProps>, "onClose" | " children">
	onClose?(): void
}

export default async function openChangeAvatar({ props, onClose }: Options) {
	const { wallet } = store

	const controller = new ControllerChangeWallet()

	const close = () => {
		Keyboard.dismiss()
		gbs.close()
	}

	const goBack = () => (controller.steps.history.length > 1 ? controller.steps.goBack() : close())

	const setWallet = () => {
		wallet.changeActive(controller.selected)
		close()
	}

	const saveEdited = () => {
		controller.saveName()
		close()
	}

	const showMnemonic = async () => {
		const edited = controller.edited
		if (edited) {
			close()
			controller.setPhrase((await edited.wallets.btsg.Mnemonic()).split(" "))
			controller.steps.goTo("View Mnemonic Seed")
			open()
		}
	}

	const open = async () => {
		gbs.backHandler = goBack

		await gbs.setProps({
			snapPoints: ["95%"],
			...props,
			onChange(index) {
				if (index === -1) {
					gbs.removeBackHandler()
					onClose && onClose()
				}
			},
			footerComponent: () => (
				<FooterChangeWallet
					onPressSelect={setWallet}
					onPressSave={saveEdited}
					controller={controller}
				/>
			),
			children: () => (
				<ChangeWallet onPressViewMnemonic={showMnemonic} close={close} controller={controller} />
			),
		})
		requestAnimationFrame(() => gbs.expand())
	}

	open()
}
