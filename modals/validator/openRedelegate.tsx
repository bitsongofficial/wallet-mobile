import { reaction } from "mobx"
import { RedelegateController } from "./controllers"
import { FooterRedelegate } from "./components/organisms"
import { Redelegate } from "./components/template"
import { store } from "stores/Store"
import { gbs } from "modals"

type Options = {
	controller: RedelegateController
	onDone?(): void
	onClose?(): void
}

export default async function openRedelegate({ controller, onClose, onDone }: Options) {
	const { coin: coinStore } = store
	controller.amountInput.setCoin(coinStore.defaultCoin) // as example

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
					return gbs.updProps({ snapPoints: [520] })
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
			<FooterRedelegate onPressDone={onDone} onPressBack={goBack} steps={steps} />
		),
		children: () => <Redelegate controller={controller} />,
	})
	gbs.snapToIndex(0)
}
