import { StyleSheet, Text, View } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetFooter, BottomSheetFooterProps, BottomSheetView } from "@gorhom/bottom-sheet"
import { Pagination } from "components/moleculs"
import { SendController } from "../controllers"
import { Header } from "../components/atoms"
import { InsertImport, SendRecap, SelectReceiver, SelectCoin, SelectNetwork } from "../components/templates"
import { COLOR } from "utils"
import { Button, ButtonBack, Footer, Icon2 } from "components/atoms"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { isValidAddress } from "core/utils/Address"
import { useKeyboard } from "@react-native-community/hooks"
import { useStore } from "hooks"
import { toJS } from "mobx"
import { s, vs } from "react-native-size-matters"
import { HORIZONTAL_WRAPPER } from "utils/constants"
import { useTranslation } from "react-i18next"
import { useCallback, useEffect, useMemo, useState } from "react"
import { SupportedCoins } from "constants/Coins"
import { Coin } from "classes"

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
	const { t } = useTranslation()
	const store = useStore()
	const hasCoins = toJS(store.coin.coins).length > 0
	const [tempCoin, setTempCoin] = useState<Coin>()

	const specificCoins = useMemo(() =>
	{
		return store.coin.coins.filter(c => (tempCoin != undefined && c.balance > 0 && c.info.denom == tempCoin.info.denom))
	}, [tempCoin, store.coin.coins])

	const { steps } = controller

	const stepsToTitle = () =>
	{
		if(steps.title === "Send Recap") return t("SendRecap")
		if(steps.title === "Insert Import") return t("SendImportTitle")
		if(steps.title === "Select Receiver") return t("SendReceiverTitle")
		if(steps.title === "Select coin") return t("SelectCoinTitle")
		if(steps.title === "Select network") return t("SelectNetworkTitle")
		return ""
	}

	const networkSelect = useCallback((coin: Coin) =>
	{
		controller.creater.setCoin(coin)
		steps.clear()
		steps.goTo("Insert Import")
	}, [])

	const coinSelect = useCallback((coin: Coin) =>
	{
		setTempCoin(coin)		
	}, [specificCoins])

	useEffect(() =>
	{
		if(specificCoins.length > 0)
		{
			if(specificCoins.length > 1)
			{
				steps.next()
			}
			else
			{
				networkSelect(specificCoins[0])
			}
		}
	}, [specificCoins])

	const selectCoinStep = () =>
	{
		setTempCoin(undefined)
		steps.goTo("Select coin")
	}

	return (
		<BottomSheetView style={[styles.container, styles.wrapper]}>
			{hasCoins ? (
				<>
					{steps.title === "Select coin" ? 
					(
						<SelectCoin
							onPress={coinSelect}
							activeCoin={tempCoin}
							coins={store.coin.multiChainCoins}
						/>
					) : (
						steps.title === "Select network" ?
						(
							<SelectCoin
								activeCoin={controller.creater.coin}
								onPress={networkSelect}
								description={t("SelectNetworkForSend")}
								title={t("SelectNetworkTitle")}
								coins={specificCoins}
							/>
						) : (
							<>
								<Header
									title={steps.title === "Send Recap" ? stepsToTitle() : t("Send")}
									subtitle={steps.title !== "Send Recap" ? stepsToTitle() : undefined}
									Pagination={<Pagination acitveIndex={steps.active} count={3} />}
									style={styles.header}
								/>
								{steps.title === "Insert Import" && (
									<InsertImport
										controller={controller}
										onPressSelectCoin={selectCoinStep}
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
						)
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
		const { t } = useTranslation()
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
									text={t("PreviewSend")}
									onPress={() => steps.goTo("Send Recap")}
									disable={!(addressInput.value != "" && isValidAddress(addressInput.value))}
									contentContainerStyle={styles.buttonPreviewSend}
									textStyle={styles.buttonText}
								/>
							)}
							{steps.title === "Send Recap" && (
								<Button
									text={t("Send")}
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
									text={t("Continue")}
									onPress={() => steps.goTo("Select Receiver")}
									disable={
										!(Number(creater.balance) <= (creater.coin?.balance ?? 0) &&
										Number(creater.balance) > 0)
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
		marginHorizontal: HORIZONTAL_WRAPPER,
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
	},
	//
	selectCoin: { marginTop: 15 },
	insertImport: {
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
