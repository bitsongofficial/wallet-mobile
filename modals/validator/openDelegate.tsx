import { reaction } from "mobx"
import { DelegateController } from "./controllers"
import { FooterDelegate } from "./components/organisms"
import { Delegate } from "./components/template"
import { store } from "stores/Store"
import { gbs } from "modals"
import { SupportedCoins } from "constants/Coins"
import { navigate } from "navigation/utils"

type Options = {
	controller: DelegateController
	onDone?(): void
	onClose?(): void
	onDismiss?(): void
}

const snapPoints = [[600], ["85%"], [450]]

export default async function openDelegate({ onDone, onClose, onDismiss, controller }: Options) {
	const status = { done: false }
	const { coin: coinStore } = store
	const validator = controller.selectedValidator
	if (validator) {
		const coin = coinStore.findAssetWithCoin(validator.chain ?? SupportedCoins.BITSONG)
		if (coin) controller.amountInput.setCoin(coin) // as example
	}

	const { steps } = controller

	const disposer = reaction(
		() => steps.active,
		(index) => gbs.updProps({ snapPoints: snapPoints[index] }),
	)

	const goBack = () => (steps.history.length > 1 ? steps.goBack() : gbs.close())

	gbs.backHandler = goBack

	const close = () => {
		disposer()
		gbs.removeBackHandler()
		onClose && onClose()
		onDismiss && !status.done && onDismiss()
	}

	await gbs.setProps({
		snapPoints: snapPoints[controller.steps.active],
		onClose: close,
		footerComponent: () => (
			<FooterDelegate controller={controller} onPressDone={() =>
				{
					status.done = true
					gbs.close()
					navigate("Loader", {
						callback: async () => (onDone ? await onDone() : false),
					})
				}}
				onPressBack={controller.disableBack ? undefined : goBack}
				steps={steps}
			/>
		),
		children: () => <Delegate controller={controller} />,
	})
	requestAnimationFrame(() => gbs.expand())
}
