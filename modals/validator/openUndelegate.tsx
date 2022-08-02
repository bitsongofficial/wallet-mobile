import { reaction } from "mobx"
import { FooterUndelegate } from "./components/organisms"
import { Undelegate } from "./components/template"
import { UndelegateController } from "./controllers"
import { store } from "stores/Store"
import { gbs } from "modals"
import { BackHandler } from "react-native"
import { SupportedCoins } from "constants/Coins"
import { navigate } from "navigation/utils"

type Options = {
	// from: IValidator
	controller: UndelegateController
	onDone?(): void
	onClose?(): void
	onDismiss?(): void
}

const snapPoints = [[600], [450]]

export default async function openUndelegate({ controller, onClose, onDone, onDismiss }: Options) {
	const status = {done: false}
	const { coin: coinStore } = store
	const validator = controller.from
	if(validator)
	{
		const coin = coinStore.findAssetWithCoin(validator.chain ?? SupportedCoins.BITSONG)
		if(coin) controller.amountInput.setCoin(coin)
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
			<FooterUndelegate onPressDone={() =>
				{
					status.done = true
					gbs.close()
					navigate("Loader", {
						// @ts-ignore
						callback: async () => (
							onDone ? (await onDone()) : false
						),
					})
				}} onPressBack={controller.disableBack ? undefined : goBack} steps={steps} />
		),
		children: () => <Undelegate controller={controller} />,
	})
	requestAnimationFrame(() => gbs.expand())
}
