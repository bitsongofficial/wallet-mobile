import { BackHandler } from "react-native"
import { gbs } from "modals"
import { FooterClaim } from "./components/organisms"
import { Claim } from "./components/template"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { navigate } from "navigation/utils"

type Options = {
	amount: string | number
	coinName: string
	onDone?(): void
	onClose?(): void,
	onDismiss?(): void,
	navigation?: NativeStackNavigationProp<any>,
}

export default async function openClaim({ onDone, onClose, onDismiss, amount, coinName, navigation }: Options) {
	const status = {done: false}
	const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
		gbs.close()
		return true
	})

	const close = () => {
		backHandler.remove()
		onClose && onClose()
		onDismiss && !status.done && onDismiss()
	}

	const navTo = navigation ? navigation.push : navigate

	await gbs.setProps({
		snapPoints: [300],
		onClose: close,
		footerComponent: () => <FooterClaim onPressDone={() =>
			{
				status.done = true
				gbs.close()
				navTo("Loader", {
					// @ts-ignore
					callback: async () => (
						onDone ? (await onDone()) : false
					),
				})
			}}
			onPressBack={gbs.close} />,
		children: () => <Claim amount={amount} coinName={coinName} />,
	})
	gbs.snapToIndex(0)
}
