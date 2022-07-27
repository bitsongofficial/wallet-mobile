import { BottomSheetProps } from "@gorhom/bottom-sheet"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useGlobalBottomsheet, useStore } from "hooks"
import { toJS } from "mobx"
import { useCallback, useMemo } from "react"
import { StyleProp, ViewStyle } from "react-native"
import { SendController } from "screens/SendModalScreens/classes"
import SendModal from "screens/SendModalScreens/SendModal"
import { RootStackParamList } from "types"

const props: Partial<BottomSheetProps> = {
	snapPoints: ["85%"],
	$modal: true,
	keyboardBehavior: "fillParent",
}

export default function useSendModal(style: StyleProp<ViewStyle>) {
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
	const gbs = useGlobalBottomsheet()

	const { coin } = useStore()

	return function() {
	
		const open = async () => {
			await gbs.setProps({ ...props, children })
			gbs.expand()
		}
	
		const controller = new SendController()
		controller.creater.setCoin(coin.coins[0])
	
		const scanReciver = async () => {
			await gbs.close()
			navigation.push("ScannerQR", {
				onBarCodeScanned: async (result) => {
					open()
					result && controller.creater.addressInput.set(result)
				},
			})
		}
	
		const children = () => {
			return (
				<SendModal
					close={() => {
						gbs.close()
						controller.clear()
					}}
					navigation={navigation}
					controller={controller}
					onPressScanQRReciver={scanReciver}
				/>)
		}
		open()		
	}
}
