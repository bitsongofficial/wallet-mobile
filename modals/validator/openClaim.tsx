import { BackHandler } from "react-native"
import { gbs } from "modals"
import { FooterClaim } from "./components/organisms"
import { Claim } from "./components/template"

type Options = {
	amount: string | number
	coinName: string
	onDone?(): void
	onClose?(): void
}

export default async function openDelegate({ onDone, onClose, amount, coinName }: Options) {
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
		footerComponent: () => <FooterClaim onPressDone={onDone} onPressBack={gbs.close} />,
		children: () => <Claim amount={amount} coinName={coinName} />,
	})
	gbs.snapToIndex(0)
}
