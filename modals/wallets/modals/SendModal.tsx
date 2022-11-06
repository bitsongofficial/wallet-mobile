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
import SelectCoinByNetwork from "../components/templates/SelectCoinByNetwork"
import { SendSteps } from "../controllers/SendController"
import { resolveAsset } from "core/utils/Coin"

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
		return store.coin.coins.filter(c => (tempCoin != undefined && c.balance > 0 && resolveAsset(c.info.denom) == resolveAsset(tempCoin.info.denom)))
	}, [tempCoin, store.coin.coins])

	const { steps } = controller

	const stepsToTitle = () =>
	{
		if(steps.title === SendSteps.Recap) return t("SendRecap")
		if(steps.title === SendSteps.Import) return t("SendImportTitle")
		if(steps.title === SendSteps.Receiver) return t("SendReceiverTitle")
		if(steps.title === SendSteps.Coin) return t("SelectCoinTitle")
		if(steps.title === SendSteps.SourceNetwork) return t("SelectNetworkTitle")
		if(steps.title === SendSteps.DestinationNetwork) return t("SelectNetworkTitle")
		return ""
	}

	const networkSelect = useCallback((coin: Coin) =>
	{
		controller.creater.setDestinationChain(undefined)
		controller.creater.setCoin(coin)
		steps.clear()
		steps.goTo(SendSteps.Import)
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
		steps.goTo(SendSteps.Coin)
	}

	const changeDestinationNetwork = (chain: SupportedCoins) =>
	{
		controller.creater.setDestinationChain(chain)
		steps.goTo(SendSteps.Receiver)
	}

	return (
		<BottomSheetView style={[styles.container, styles.wrapper]}>
			{hasCoins ? (
				<>
					{steps.title === SendSteps.Coin ? 
					(
						<SelectCoin
							onPress={coinSelect}
							activeCoin={tempCoin}
							coins={store.coin.multiChainCoins}
						/>
					) : (
						steps.title === SendSteps.SourceNetwork ?
						(
							<SelectCoinByNetwork
								activeCoin={controller.creater.coin}
								onPress={networkSelect}
								description={t("SelectNetworkForSend")}
								title={t("SelectNetworkTitle")}
								coins={specificCoins}
							/>
						) : (
						steps.title === SendSteps.DestinationNetwork ? (
							<SelectNetwork
								activeChain={controller.creater.destinationChain}
								onPress={changeDestinationNetwork}
								description={t("SelectNetworkForSend")}
								title={t("SelectNetworkForIBC")}
							/>
						) : (
							<>
								<Header
									title={steps.title === SendSteps.Recap ? stepsToTitle() : t("Send")}
									subtitle={steps.title !== SendSteps.Recap ? stepsToTitle() : undefined}
									Pagination={<Pagination acitveIndex={steps.active} count={3} />}
									style={styles.header}
								/>
								{steps.title === SendSteps.Import && (
									<InsertImport
										controller={controller}
										onPressSelectCoin={selectCoinStep}
										style={styles.insertImport}
									/>
								)}
								{steps.title === SendSteps.Receiver && (
									<SelectReceiver
										controller={controller}
										onPressScanner={onPressScanQRReciver}
										style={styles.selectReceiver}
									/>
								)}
								{steps.title === SendSteps.Recap && <SendRecap controller={controller} />}
							</>
						)
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
		if (steps.title === SendSteps.Recap && keyboard.keyboardShown) return null

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
							{steps.title === SendSteps.Receiver && (
								<Button
									text={t("PreviewSend")}
									onPress={() => steps.goTo(SendSteps.Recap)}
									disable={!(addressInput.value != "" && isValidAddress(addressInput.value))}
									contentContainerStyle={styles.buttonPreviewSend}
									textStyle={styles.buttonText}
								/>
							)}
							{steps.title === SendSteps.Recap && (
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
							{steps.title === SendSteps.Import && (
								<Button
									text={t("Continue")}
									onPress={() => controller.isIbc ? steps.goTo(SendSteps.DestinationNetwork) :  steps.goTo(SendSteps.Receiver)}
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
