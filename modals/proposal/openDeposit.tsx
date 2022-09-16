import { Keyboard, StyleSheet } from "react-native"
import { gbs } from "modals"
import { COLOR, wait } from "utils"
import { Deposit, DepositController, FooterDeposit } from "./components/templates"
import { navigate } from "navigation/utils"
import { store } from "stores/Store"
import mock_2 from "classes/mock_2"
import { Coin } from "classes"
import { reaction } from "mobx"
import { Proposal } from "core/types/coin/cosmos/Proposal"
import { s } from "react-native-size-matters"

type Options = {
	proposal: Proposal
	controller?: DepositController
	onClose?(): void
	onDone?(): Promise<any>
	onDismiss?(): void
}

const snapPoints = [[s(594)], [s(445)]]

export default async function openDeposit({
	controller = new DepositController(),
	proposal,
	onClose,
	onDone,
	onDismiss,
}: Options) {
	const status = { done: false }
	// const { coin: coinStore } = store
	controller.amountInput.setCoin(new Coin(mock_2.BitSong))
	controller.setMinDeposit(500)

	const close = async () => {
		gbs.close()
		await wait(400)
		Keyboard.dismiss()
	}

	const { steps } = controller

	const goBack = () => (steps.history.length > 1 ? steps.goBack() : close())

	const done = () => {
		status.done = true
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
			backgroundStyle: styles.background,

			onChange(index) {
				if (index === -1) {
					gbs.removeBackHandler()
					disposer()
					onClose && onClose()
					onDismiss && !status.done && onDismiss()
				}
			},
			children: () => <Deposit controller={controller} proposal={proposal} />,
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
