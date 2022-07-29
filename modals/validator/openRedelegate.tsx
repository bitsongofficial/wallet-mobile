import { reaction } from "mobx"
import { RedelegateController } from "./controllers"
import { FooterRedelegate } from "./components/organisms"
import { Redelegate } from "./components/template"
import { store } from "stores/Store"
import { gbs } from "modals"
import { BackHandler } from "react-native"
import { SupportedCoins } from "constants/Coins"

type Options = {
	controller: RedelegateController
	onDone?(): void
	onClose?(): void
}

const snapPoints = [[600], ["85%"], [520]]

export default async function openRedelegate({ controller, onClose, onDone }: Options) {
	const { coin: coinStore } = store
	const validator = controller.from
	if(validator)
	{
		const coin = coinStore.coinOfType(validator.chain ?? SupportedCoins.BITSONG)
		if(coin) controller.amountInput.setCoin(coin)
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
			<FooterRedelegate onPressDone={() =>
				{
					onDone && onDone()
					gbs.close()
				}} onPressBack={goBack} steps={steps} />
		),
		children: () => <Redelegate controller={controller} />,
	})
	gbs.snapToIndex(0)
}
