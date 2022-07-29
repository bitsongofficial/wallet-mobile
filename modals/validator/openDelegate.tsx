import { reaction } from "mobx"
import { DelegateController } from "./controllers"
import { FooterDelegate } from "./components/organisms"
import { Delegate } from "./components/template"
import { store } from "stores/Store"
import { gbs } from "modals"
import { BackHandler } from "react-native"
import { SupportedCoins } from "constants/Coins"

type Options = {
	controller: DelegateController
	onDone?(): void
	onClose?(): void
}

const snapPoints = [[600], ["85%"], [450]]

export default async function openDelegate({ onDone, onClose, controller }: Options) {
	const { coin: coinStore } = store
	const validator = controller.selectedValidator
	if(validator)
	{
		const coin = coinStore.coinOfType(validator.chain ?? SupportedCoins.BITSONG)
		if(coin) controller.amountInput.setCoin(coin) // as example
	}

	const { steps } = controller

	const disposer = reaction(
		() => steps.active,
		(index) => gbs.updProps({ snapPoints: snapPoints[index] }),
	)

	const goBack = () => (steps.history.length > 1 ? steps.goBack() : gbs.close())

	const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
		goBack()
		return true
	})

	const close = () => {
		disposer()
		backHandler.remove()
		onClose && onClose()
	}

	await gbs.setProps({
		snapPoints: snapPoints[controller.steps.active],
		onClose: close,
		footerComponent: () => (
			<FooterDelegate onPressDone={() =>
				{
					onDone && onDone()
					gbs.close()
				}} onPressBack={goBack} steps={steps} />
		),
		children: () => <Delegate controller={controller} />,
	})
	requestAnimationFrame(() => gbs.expand())
}
