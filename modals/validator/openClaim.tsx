import { BackHandler } from "react-native"
import { gbs } from "modals"
import { FooterClaim } from "./components/organisms"
import { Claim } from "./components/template"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

type Options = {
	amount: string | number
	coinName: string
	onDone?(): void
	onClose?(): void,
	navigation?: NativeStackNavigationProp<any>,
}

export default async function openClaim({ onDone, onClose, amount, coinName, navigation }: Options) {
	const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
		gbs.close()
		return true
	})

	const close = () => {
		backHandler.remove()
		onClose && onClose()
	}

	await gbs.setProps({
		snapPoints: [300],
		onClose: close,
		footerComponent: () => <FooterClaim onPressDone={() =>
			{
				gbs.close()
				navigation?.push("Loader", {
					// @ts-ignore
					callback: async () => {
						onDone && (await onDone())
					},
				})				
			}}
			onPressBack={gbs.close} />,
		children: () => <Claim amount={amount} coinName={coinName} />,
	})
	gbs.snapToIndex(0)
}
