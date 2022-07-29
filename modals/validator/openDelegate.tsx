import { reaction } from "mobx"
import { DelegateController } from "./controllers"
import { FooterDelegate } from "./components/organisms"
import { Delegate } from "./components/template"
import { store } from "stores/Store"
import { gbs } from "modals"
import { BackHandler } from "react-native"

type Options = {
	controller: DelegateController
	onDone?(): void
	onClose?(): void
}

const snapPoints = [[600], ["85%"], [450]]

export default async function openDelegate({ onDone, onClose, controller }: Options) {
	const { coin: coinStore } = store
	controller.amountInput.setCoin(coinStore.defaultCoin) // as example

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
	}

	await gbs.setProps({
		snapPoints: snapPoints[controller.steps.active],
		onClose: close,
		footerComponent: () => (
			<FooterDelegate onPressDone={onDone} onPressBack={goBack} steps={steps} />
		),
		children: () => <Delegate controller={controller} />,
	})
	requestAnimationFrame(() => gbs.expand())
}
