import { Keyboard, StyleSheet } from "react-native"
import { gbs } from "modals"
import { COLOR, wait } from "utils"
import { Deposit, DepositeController, FooterDeposit } from "./components/templates"
import { navigate } from "navigation/utils"
import { store } from "stores/Store"
import mock_2 from "classes/mock_2"
import { Coin } from "classes"
import { reaction } from "mobx"

type Options = {
	controller?: DepositeController
	onClose?(): void
	onDone?(): void
}

const snapPoints = [[594], [445]]

export default async function openVote({
	controller = new DepositeController(),
	onClose,
	onDone,
}: Options) {
	// const { coin: coinStore } = store
	controller.amountInput.setCoin(new Coin(mock_2.BitSong))
	controller.setMinDeposite(500)

	const close = async () => {
		gbs.close()
		await wait(400)
		Keyboard.dismiss()
	}

	const { steps } = controller

	const goBack = () => (steps.history.length > 1 ? steps.goBack() : close())

	const done = () => {
		gbs.close()
		if (onDone) {
			navigate("Loader", { callback: onDone })
		}
	}

	const open = async () => {
		gbs.backHandler = () => {
			goBack()
		}

		const disposer = reaction(
			() => steps.active,
			(index) => gbs.updProps({ snapPoints: snapPoints[index] }),
		)

		await gbs.setProps({
			snapPoints: snapPoints[steps.active],
			enableContentPanningGesture: false,
			backgroundStyle: styles.background,

			onChange(index) {
				if (index === -1) {
					gbs.removeBackHandler()
					disposer()
					onClose && onClose()
				}
			},
			children: () => <Deposit controller={controller} />,
			footerComponent: () => (
				<FooterDeposit controller={controller} onPressBack={goBack} onPressDone={done} />
			),
		})

		requestAnimationFrame(() => gbs.expand())
	}

	open()
}

const styles = StyleSheet.create({
	background: { backgroundColor: COLOR.Dark2 },
	buttonContent: {
		paddingHorizontal: 40,
		paddingVertical: 18,
	},
	buttonText: {
		fontSize: 16,
		lineHeight: 20,
	},
})
