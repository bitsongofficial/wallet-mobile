import { StyleSheet, Text, View } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetFooter, BottomSheetFooterProps, BottomSheetView } from "@gorhom/bottom-sheet"
import { Pagination } from "components/moleculs"
import { SendController } from "../controllers"
import { Header } from "../components/atoms"
import { InsertImport, SendRecap, SelectReceiver, SelectCoin } from "../components/templates"
import { COLOR } from "utils"
import { HORIZONTAL_WRAPPER } from "../constants"
import { Button, ButtonBack, Footer, Icon2 } from "components/atoms"
import { FOOTER_HEIGHT } from "components/atoms/Footer"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { isValidAddress } from "core/utils/Address"
import { useKeyboard } from "@react-native-community/hooks"
import { useStore } from "hooks"
import { toJS } from "mobx"
import { s, vs } from "react-native-size-matters"

type Props = {
	controller: SendController
	onPressScanQRReciver(): void
	onPressBack(): void
}

export default observer<Props>(function SendModal({
	controller,
	onPressScanQRReciver,
	onPressBack,
}) {
	const store = useStore()
	const hasCoins = toJS(store.coin.coins).length > 0

	const { steps } = controller

	return (
		<BottomSheetView style={styles.container}>
			{hasCoins ? (
				<>
					{steps.title === "Select coin" ? (
						<SelectCoin controller={controller} onBack={onPressBack} />
					) : (
						<>
							<Header
								title={steps.title === "Send Recap" ? steps.title : "Send"}
								subtitle={steps.title !== "Send Recap" ? steps.title : undefined}
								Pagination={<Pagination acitveIndex={steps.active} count={3} />}
								style={styles.header}
							/>
							{steps.title === "Insert Import" && (
								<InsertImport
									controller={controller}
									onPressSelectCoin={() => steps.goTo("Select coin")}
									style={styles.insertImport}
								/>
							)}
							{steps.title === "Select Receiver" && (
								<SelectReceiver
									controller={controller}
									onPressScanner={onPressScanQRReciver}
									style={styles.selectReceiver}
								/>
							)}
							{steps.title === "Send Recap" && <SendRecap controller={controller} />}
						</>
					)}
				</>
			) : (
				<View style={styles.verticallyCentered}>
					<Text style={{ color: COLOR.White }}>No assets available to send</Text>
				</View>
			)}
		</BottomSheetView>
	)
})

type FooterProps = BottomSheetFooterProps & {
	controller: SendController
	onPressBack(): void
	onPressSend(): void
}

export const FooterSendModal = observer(
	({ controller, onPressBack, onPressSend, animatedFooterPosition }: FooterProps) => {
		const { steps, creater } = controller
		const { addressInput } = creater

		const insets = useSafeAreaInsets()
		const keyboard = useKeyboard()

		const store = useStore()
		const hasCoins = toJS(store.coin.coins).length > 0

		if (!hasCoins) return null
		if (steps.title === "Send Recap" && keyboard.keyboardShown) return null

		return (
			<BottomSheetFooter
				animatedFooterPosition={animatedFooterPosition}
				style={{ paddingBottom: 16 }}
				bottomInset={insets.bottom}
			>
				<Footer
					Left={<ButtonBack onPress={onPressBack} />}
					Center={
						<>
							{steps.title === "Select Receiver" && (
								<Button
									text="Preview Send"
									onPress={() => steps.goTo("Send Recap")}
									disable={addressInput.value != "" && isValidAddress(addressInput.value)}
									contentContainerStyle={styles.buttonPreviewSend}
									textStyle={styles.buttonText}
								/>
							)}
							{steps.title === "Send Recap" && (
								<Button
									text="Send"
									onPress={onPressSend}
									contentContainerStyle={styles.buttonSend}
									textStyle={styles.buttonText}
								/>
							)}
						</>
					}
					Right={
						<>
							{steps.title === "Insert Import" && (
								<Button
									text="Continue"
									onPress={() => steps.goTo("Select Receiver")}
									disable={
										Number(creater.balance) <= (creater.coin?.balance || 0) &&
										Number(creater.balance) > 0
									}
									contentContainerStyle={styles.buttonContinue}
									textStyle={styles.buttonText}
									Right={
										<Icon2
											name="chevron_right_2"
											stroke={COLOR.White}
											size={18}
											style={{ marginLeft: 24 }}
										/>
									}
								/>
							)}
						</>
					}
				/>
			</BottomSheetFooter>
		)
	},
)

const styles = StyleSheet.create({
	container: { flexGrow: 1 },
	wrapper: {
		// marginHorizontal: 30,
		flex: 1,
	},
	verticallyCentered: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	header: {
		marginTop: vs(10),
		marginHorizontal: HORIZONTAL_WRAPPER,
	},
	//
	selectCoin: { marginTop: 15 },
	insertImport: {
		// flexGrow: 1,
		marginHorizontal: HORIZONTAL_WRAPPER,
		// marginBottom: FOOTER_HEIGHT + 100,
		backgroundColor: "orange",
	},
	selectReceiver: { flex: 1 },

	// footer
	buttonText: {
		fontSize: s(16),
		lineHeight: s(20),
	},
	buttonContinue: {
		paddingHorizontal: s(24),
		paddingVertical: s(18),
	},
	buttonPreviewSend: {
		paddingHorizontal: s(40),
		paddingVertical: s(18),
	},
	buttonSend: {
		paddingHorizontal: s(46),
		paddingVertical: s(18),
	},
})
