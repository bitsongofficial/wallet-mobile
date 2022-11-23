import { BottomSheetProps } from "@gorhom/bottom-sheet"
import { CosmosWallet } from "core/storing/Wallet"
import { firstAvailableWallet } from "core/utils/Coin"
import { gbs } from "modals"
import { Dimensions, Keyboard } from "react-native"
import { vs } from "react-native-size-matters"
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
	controller.setSelected(wallet.activeWallet)

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
			const wallet = firstAvailableWallet(edited.wallets) as CosmosWallet
			if(wallet)
			{
				close()
				controller.setPhrase((await wallet.Mnemonic()).split(" "))
				controller.steps.goTo("View Mnemonic Seed")
				open()
			}
		}
	}

	const window = Dimensions.get("window")

	const open = async () => {
		gbs.backHandler = goBack

		await gbs.setProps({
			snapPoints: [window.height - vs(100)],
			...props,
			onChange(index) {
				if (index === -1) {
					gbs.removeBackHandler()
					onClose && onClose()
				}
			},
			children: () => (
				<ChangeWallet
					//
					onPressViewMnemonic={showMnemonic}
					close={close}
					controller={controller}
				/>
			),
			footerComponent: () => (
				<FooterChangeWallet
					onPressSelect={setWallet}
					onPressSave={saveEdited}
					controller={controller}
				/>
			),
		})
		requestAnimationFrame(() => gbs.expand())
	}

	open()
}
