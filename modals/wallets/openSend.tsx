import { SupportedCoins } from "constants/Coins"
import { gbs } from "modals"
import { navigate } from "navigation/utils"
import { Keyboard, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { SendController } from "./controllers"
import { FooterSendModal, SendModal } from "./modals"
import { store } from "stores/Store"
import { wait } from "utils"
import { BottomSheetFooterProps, BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet"
import { SendSteps } from "./controllers/SendController"
import { FooterSend } from "./modals/SendModal"
import { s } from "react-native-size-matters"

export default function openSendModal(style: StyleProp<ViewStyle>) {
	const { coin } = store
	const controller = new SendController()
	const { creater, steps } = controller
	steps.goTo(SendSteps.Coin)
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
				callback: async () =>
				{
					console.log(coin.info.coin, addressInput.value, balance, coin.info.denom)
					return await store.coin.sendCoin(coin.info.coin, addressInput.value, balance, coin.info.denom)
				},
			})
		}
		gbs.close()
	}

	const goBack = () => (steps.active > 0 ? steps.goBack() : gbs.close())

	const open = async () => {
		gbs.backHandler = () => {
			goBack()
		}

		await gbs.setProps({
			snapPoints: ["85%"],
			keyboardBehavior: "interactive",
			enableContentPanningGesture: false,
			onChange(index) {
				if (index === -1) {
					Keyboard.dismiss()
					controller.clear()
					gbs.removeBackHandler()
				}
			},
			children: () => (
				<BottomSheetView style={styles.container}>
					<SendModal
						controller={controller}
						onPressScanQRReciver={scanReciver}
						onPressBack={goBack}
					/>
					<FooterSend
						controller={controller}
						onPressBack={goBack}
						onPressSend={send}
						style={styles.footer}
					></FooterSend>
				</BottomSheetView>
			),
		})

		requestAnimationFrame(() => gbs.expand())
	}

	coin.CanSend && open()
}

const styles = StyleSheet.create({
	container: {
		minHeight: "100%",
		paddingBottom: s(8),
		display: "flex",
		flexDirection: "column",
	},
	footer: {
		flexShrink: 0,
	}
})