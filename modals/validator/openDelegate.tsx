import { reaction } from "mobx"
import { DelegateController } from "./controllers"
import { FooterDelegate } from "./components/organisms"
import { Delegate } from "./components/template"
import { store } from "stores/Store"
import { gbs } from "modals"
import { SupportedCoins } from "constants/Coins"

type Options = {
	controller: DelegateController
	onDone?(): void
	onClose?(): void
}

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
		(index) => {
			switch (index) {
				case 0:
					return gbs.updProps({ snapPoints: [600] })
				case 1:
					return gbs.updProps({ snapPoints: ["85%"] })
				case 2:
					return gbs.updProps({ snapPoints: [450] })

				default:
					break
			}
		},
	)

	const goBack = () => (steps.active > 0 ? steps.prev() : gbs.close())
	const close = () => {
		disposer()
		onClose && onClose()
	}

	await gbs.setProps({
		snapPoints: [600],
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
	gbs.snapToIndex(0)
}