import { SupportedCoins } from "constants/Coins"
import { gbs } from "modals"
import { navigate } from "navigation/utils"
import { Keyboard, StyleProp, ViewStyle } from "react-native"
import { SendController } from "./controllers"
import { FooterSendModal, SendModal } from "./modals"
import { store } from "stores/Store"
import { wait } from "utils"
import { BottomSheetFooterProps } from "@gorhom/bottom-sheet"

export default function openSendModal(style: StyleProp<ViewStyle>) {
	const { coin } = store
	const controller = new SendController()
	const { creater, steps } = controller
	creater.setCoin(coin.findAssetWithCoin(SupportedCoins.BITSONG) ?? coin.coins[0])

	const scanReciver = async () => {
		Keyboard.dismiss()
		await wait(300)
		requestAnimationFrame(() => {
			gbs.close()
			navigate("ScannerQR", {
				onBarCodeScanned: async (result) => controller.creater.addressInput.set(result),
				onClose: open,
			})
		})
	}

	const send = () => {
		const { coin, addressInput, balance } = creater
		if (store.coin.hasCoins && coin && addressInput && balance) {
			navigate("Loader", {
				callback: () => store.coin.sendCoin(coin.info.coin, addressInput.value, balance),
			})
		}
		// navigate("Loader", {
		// 	callback: async () => {
		// 		await wait(2000) // for example
		// 		return true
		// 	},
		// })
		close()
	}

	const close = async () => {
		Keyboard.dismiss()
		gbs.close()
		controller.clear()
	}

	const goBack = () => (steps.active > 0 ? steps.goBack() : close())

	const open = async () => {
		gbs.backHandler = () => {
			goBack()
		}

		await gbs.setProps({
			snapPoints: ["85%"],
			keyboardBehavior: "interactive",
			enableContentPanningGesture: false,
			children: () => (
				<SendModal
					controller={controller}
					onPressScanQRReciver={scanReciver}
					onPressBack={goBack}
				/>
			),
			footerComponent: (props: BottomSheetFooterProps) => (
				<FooterSendModal
					{...props}
					controller={controller}
					onPressBack={goBack}
					onPressSend={send}
				/>
			),
		})

		requestAnimationFrame(() => gbs.expand())
	}

	coin.CanSend && open()
}
