import { SupportedCoins } from "constants/Coins"
import { gbs } from "modals"
import { navigate } from "navigation/utils"
import { StyleProp, ViewStyle } from "react-native"
import { SendController } from "./controllers"
import { SendModal } from "./modals"
import { store } from "stores/Store"

export default function openSendModal(style: StyleProp<ViewStyle>) {
	const { coin } = store
	const controller = new SendController()
	controller.creater.setCoin(coin.findAssetWithCoin(SupportedCoins.BITSONG) ?? coin.coins[0])

	const scanReciver = async () => {
		await gbs.close()
		navigate("ScannerQR", {
			onBarCodeScanned: async (result) => controller.creater.addressInput.set(result),
			onClose: open,
		})
	}

	const close = () => {
		gbs.close()
		controller.clear()
	}

	const open = async () => {
		await gbs.setProps({
			snapPoints: ["85%"],
			$modal: true,
			keyboardBehavior: "fillParent",
			children: () => (
				<SendModal close={close} controller={controller} onPressScanQRReciver={scanReciver} />
			),
		})
		gbs.expand()
	}

	coin.CanSend && open()
}
