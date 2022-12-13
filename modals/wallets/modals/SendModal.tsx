import { StyleSheet, Text, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetFooter, BottomSheetFooterProps, BottomSheetView } from "@gorhom/bottom-sheet"
import { Pagination } from "components/moleculs"
import { SendController } from "../controllers"
import { Header } from "../components/atoms"
import { InsertImport, SendRecap, SelectReceiver, SelectCoin, SelectNetwork } from "../components/templates"
import { COLOR } from "utils"
import { Button, ButtonBack, Footer, Icon2 } from "components/atoms"
import { isValidAddress } from "core/utils/Address"
import { useKeyboard } from "@react-native-community/hooks"
import { useStore } from "hooks"
import { toJS } from "mobx"
import { s, vs } from "react-native-size-matters"
import { HORIZONTAL_WRAPPER } from "utils/constants"
import { useTranslation } from "react-i18next"
import { useCallback, useEffect, useMemo, useState } from "react"
import SelectCoinByNetwork from "../components/templates/SelectCoinByNetwork"
import { SendSteps } from "../controllers/SendController"
import { AssetBalance } from "stores/models/AssetBalance"

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
	const hasCoins = store.coin.hasCoins
	const [tempAsset, setTempAsset] = useState<AssetBalance>()

	const specificAssets = useMemo(() =>
	{
		return store.coin.orderedBalance.filter(b => (tempAsset != undefined && b.balance > 0 && store.assets.AssetDenom(b.denom) == store.assets.AssetDenom(tempAsset.denom)))
	}, [tempAsset, store.coin.orderedBalance])

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

	const networkSelect = useCallback((assetBalance: AssetBalance) =>
	{
		controller.creater.setDestinationChainId(undefined)
		controller.creater.setChain(assetBalance.chain)
		const asset = store.assets.ResolveAsset(assetBalance.denom)
		if(asset) controller.creater.setAsset(asset)
		steps.clear()
		steps.goTo(SendSteps.Import)
	}, [store.assets])

	const assetSelect = useCallback((asset: AssetBalance) =>
	{
		setTempAsset(asset)		
	}, [specificAssets])

	useEffect(() =>
	{
		if(specificAssets.length > 0)
		{
			if(specificAssets.length > 1)
			{
				steps.next()
			}
			else
			{
				networkSelect(specificAssets[0])
			}
		}
	}, [specificAssets])

	const selectCoinStep = () =>
	{
		setTempAsset(undefined)
		steps.goTo(SendSteps.Coin)
	}

	const changeDestinationNetwork = (chain: string) =>
	{
		controller.creater.setDestinationChainId(chain)
		steps.goTo(SendSteps.Receiver)
	}

	return (
		<BottomSheetView style={[styles.container, styles.wrapper]}>
			{hasCoins ? (
				<>
					{steps.title === SendSteps.Coin ? 
					(
						<SelectCoin
							onPress={assetSelect}
							activeAsset={tempAsset}
							assets={store.coin.multiChainOrderedBalance}
						/>
					) : (
						steps.title === SendSteps.SourceNetwork ?
						(
							<SelectCoinByNetwork
								activeChain={controller.creater.chain}
								onPress={networkSelect}
								description={t("SelectNetworkForSend")}
								title={t("SelectNetworkTitle")}
								assets={specificAssets}
							/>
						) : (
						steps.title === SendSteps.DestinationNetwork ? (
							<SelectNetwork
								activeChain={controller.creater.destinationChainId}
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
					<Text style={{ color: COLOR.White }}>{t("NoAssets")}</Text>
				</View>
			)}
		</BottomSheetView>
	)
})

type FooterProps = {
	controller: SendController
	onPressBack(): void
	onPressSend(): void
	style?: ViewStyle,
}

export const FooterSend = observer(
	({ style, controller, onPressBack, onPressSend }: FooterProps) => {
		const { t } = useTranslation()
		const { steps, creater } = controller
		const { addressInput } = creater

		const keyboard = useKeyboard()

		const store = useStore()
		const hasCoins = toJS(store.coin.balance).length > 0

		if (!hasCoins) return null
		if (steps.title === SendSteps.Recap && keyboard.keyboardShown) return null

		return (
			<Footer
				style={style}
				Left={<ButtonBack onPress={onPressBack} />}
				Center={
					<>
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
									creater.asset == null || (
										!(Number(creater.balance) <= (store.coin.balanceOf(creater.asset) ?? 0) &&
										Number(creater.balance) > 0)
									)
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
						{steps.title === SendSteps.Receiver && (
							<Button
								text={t("PreviewSend")}
								onPress={() => steps.goTo(SendSteps.Recap)}
								disable={!(addressInput.value != "" && isValidAddress(addressInput.value))}
								contentContainerStyle={styles.buttonPreviewSend}
								textStyle={styles.buttonText}
							/>
						)}
					</>
				}
			/>
		)
	},
)

export const FooterSendModal = observer(
	({ animatedFooterPosition, ...props }: BottomSheetFooterProps & FooterProps) => {

		return (
			<BottomSheetFooter
				animatedFooterPosition={animatedFooterPosition}
				style={{ paddingBottom: 16 }}
			>
				<FooterSend {...props}>

				</FooterSend>
			</BottomSheetFooter>
		)
	},
)

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		flexShrink: 1,
	},
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
