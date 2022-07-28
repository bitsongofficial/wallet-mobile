import { reaction } from "mobx"
import { FooterUndelegate } from "./components/organisms"
import { Undelegate } from "./components/template"
import { UndelegateController } from "./controllers"
import { store } from "stores/Store"
import { gbs } from "modals"
import { BackHandler } from "react-native"

type Options = {
	// from: IValidator
	controller: UndelegateController
	onDone?(): void
	onClose?(): void
}

const snapPoints = [[600], [450]]

export default async function openUndelegate({ controller, onClose, onDone }: Options) {
	const { coin: coinStore } = store
	controller.amountInput.setCoin(coinStore.defaultCoin) // as example

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
			<FooterUndelegate onPressDone={onDone} onPressBack={goBack} steps={steps} />
		),
		children: () => <Undelegate controller={controller} />,
	})
	requestAnimationFrame(() => gbs.expand())
}
