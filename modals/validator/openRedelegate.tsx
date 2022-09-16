import { reaction } from "mobx"
import { RedelegateController } from "./controllers"
import { FooterRedelegate } from "./components/organisms"
import { Redelegate } from "./components/template"
import { store } from "stores/Store"
import { gbs } from "modals"
import { SupportedCoins } from "constants/Coins"
import { navigate } from "navigation/utils"
import { s } from "react-native-size-matters"

type Options = {
	controller: RedelegateController
	onDone?(): void
	onClose?(): void
	onDismiss?(): void
}

const snapPoints = [[s(600)], ["85%"], [s(520)]]

export default async function openRedelegate({ controller, onClose, onDone, onDismiss }: Options) {
	const status = { done: false }
	const { coin: coinStore } = store

	const validator = controller.from
	if (validator) {
		const coin = coinStore.findAssetWithCoin(validator.chain ?? SupportedCoins.BITSONG)
		if (coin) controller.amountInput.setCoin(coin)
	}

	const { steps } = controller

	const disposer = reaction(
		() => steps.active,
		(index) => gbs.updProps({ snapPoints: snapPoints[index] }),
	)

	const goBack = () => (steps.history.length > 1 ? steps.goBack() : gbs.close())
	gbs.backHandler = goBack

	await gbs.setProps({
		snapPoints: snapPoints[controller.steps.active],
		onChange(index) {
			if (index === -1) {
				disposer()
				gbs.removeBackHandler()
				onClose && onClose()
				onDismiss && !status.done && onDismiss()
			}
		},
		footerComponent: () => (
			<FooterRedelegate
				onPressDone={() => {
					status.done = true
					gbs.close()
					navigate("Loader", {
						// @ts-ignore
						callback: async () => (onDone ? await onDone() : false),
					})
				}}
				onPressBack={controller.disableBack ? undefined : goBack}
				steps={steps}
			/>
		),
		children: () => <Redelegate controller={controller} />,
	})
	requestAnimationFrame(() => gbs.expand())
}
