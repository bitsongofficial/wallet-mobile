import { StyleProp, StyleSheet, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { COLOR } from "utils"
import { StepDepositSetAmount, StepDepositRecap } from "../moleculs"
import { BottomSheetHeader, Pagination } from "components/moleculs"
import { makeAutoObservable } from "mobx"
import { AmountInput, Steps } from "classes"
import { Button, ButtonBack, Footer, Icon2 } from "components/atoms"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Proposal } from "core/types/coin/cosmos/Proposal"
import { SupportedCoins } from "constants/Coins"

// -------------- Controller ---------------------

export class DepositController {
	steps = new Steps(["Deposit", "Deposit Recap"])
	amountInput = new AmountInput()

	minDeposit: null | number = null

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	setMinDeposit(value: number) {
		this.minDeposit = value
	}
}

// -------------- Template ---------------------

type Props = {
	controller: DepositController
	proposal: Proposal
}

export default observer<Props>(({ controller, proposal }) => {
	const { steps, amountInput } = controller

	return (
		<BottomSheetView style={styles.container}>
			<BottomSheetHeader
				title={steps.title}
				subtitle={steps.active === 0 && "Insert BTSG"}
				Pagination={<Pagination acitveIndex={steps.active} count={2} />}
			/>

			{steps.active === 0 && amountInput.coin && (
				<StepDepositSetAmount
					min={controller.minDeposit}
					coin={amountInput.coin}
					amount={amountInput.value}
					onPressDelNum={amountInput.removeAmountNumber}
					onPressMax={amountInput.setMax}
					onPressNum={amountInput.addAmountNumber}
				/>
			)}

			{steps.active === 1 && (
				<StepDepositRecap
					amount={controller.amountInput.value}
					chain={proposal.chain ?? SupportedCoins.BITSONG}
					proposalId={proposal.id}
				/>
			)}
		</BottomSheetView>
	)
})

// -------------  Footer ----------------------

type FooterProps = {
	onPressBack(): void
	onPressDone(): void
	style?: StyleProp<ViewStyle>
	controller: DepositController
}

export const FooterDeposit = observer(
	({ onPressBack, onPressDone, controller, style }: FooterProps) => {
		const insets = useSafeAreaInsets()
		const { steps, minDeposit, amountInput } = controller
		return (
			<Footer
				style={[{ marginBottom: insets.bottom + 16 }, style]}
				Left={<ButtonBack onPress={onPressBack} />}
				Center={
					steps.active === 1 && (
						<Button
							text="Deposit"
							contentContainerStyle={styles.buttonContentCenter}
							textStyle={styles.buttonText}
							onPress={onPressDone}
						/>
					)
				}
				Right={
					steps.active === 0 && (
						<Button
							text="Continue"
							disable={!!minDeposit && Number(amountInput.value) < minDeposit}
							contentContainerStyle={styles.buttonContent}
							textStyle={styles.buttonText}
							onPress={steps.next}
							Right={
								<Icon2
									name="chevron_right"
									style={styles.icon}
									size={18}
									stroke={COLOR.White}
									//
								/>
							}
						/>
					)
				}
			/>
		)
	},
)

// -----------------------------------

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 30,
		paddingTop: 25,
	},
	title: { marginBottom: 31 },
	card: {
		backgroundColor: COLOR.Dark2,
		paddingLeft: 20,
		paddingHorizontal: 23,
		paddingTop: 32,
		paddingBottom: 26,
	},

	// --------- Footer -------

	buttonText: {
		fontSize: 16,
		lineHeight: 20,
	},
	icon: {
		marginLeft: 24,
	},
	buttonContent: {
		paddingHorizontal: 24,
		paddingVertical: 18,
	},
	buttonContentCenter: {
		paddingHorizontal: 40,
		paddingVertical: 18,
	},
})
