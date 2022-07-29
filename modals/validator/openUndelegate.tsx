import { reaction } from "mobx"
import { FooterUndelegate } from "./components/organisms"
import { Undelegate } from "./components/template"
import { UndelegateController } from "./controllers"
import { store } from "stores/Store"
import { gbs } from "modals"
import { SupportedCoins } from "constants/Coins"

type Options = {
	// from: IValidator
	controller: UndelegateController
	onDone?(): void
	onClose?(): void
}

export default async function openUndelegate({ controller, onClose, onDone }: Options) {
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
		(index) => {
			switch (index) {
				case 0:
					return gbs.updProps({ snapPoints: [600] })
				case 1:
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
			<FooterUndelegate onPressDone={() =>
				{
					onDone && onDone()
					gbs.close()
				}} onPressBack={goBack} steps={steps} />
		),
		children: () => <Undelegate controller={controller} />,
	})
	gbs.snapToIndex(0)
}
