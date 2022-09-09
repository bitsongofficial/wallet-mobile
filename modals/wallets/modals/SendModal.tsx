import { useCallback, useEffect, useMemo, useState } from "react"
import { BackHandler, NativeEventSubscription, StyleSheet, Text, View } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { useStore } from "hooks"
import { Pagination } from "components/moleculs"
import { SendController } from "../controllers"
import { Header } from "../components/atoms"
import { InsertImport, SendRecap, SelectReceiver, SelectCoin } from "../components/templates"
import { COLOR } from "utils"
import { navigate } from "navigation/utils"
import { toJS } from "mobx"

type Props = {
	close(): void
	controller: SendController
	onPressSend(): void
	onPressScanQRReciver(): void
}

export default observer<Props>(function SendModal({
	close,
	controller,
	onPressScanQRReciver,
	onPressSend,
}) {
	const store = useStore()
	// console.log("store.coin.coins.length :>> ", store.coin.coins.length)

	const hasCoins = toJS(store.coin.coins).length > 0

	const steps = hasCoins
		? controller.steps
		: { title: "No available assets", goBack: close, active: 0, goTo: () => {} }

	const creater = hasCoins
		? controller.creater
		: { coin: undefined, addressInput: undefined, balance: undefined }

	const goBack = useCallback(
		() => (steps.title === "Insert Import" ? close() : steps.goBack()),
		[steps, close],
	)

	// --------- Header --------------
	const isShowHeader = steps.title !== "Select coin" && steps.title !== "No available assets"
	const title = useMemo(() => (steps.title === "Send Recap" ? steps.title : "Send"), [steps.title])
	const subtitle = useMemo(
		() => (steps.title !== "Send Recap" ? steps.title : undefined),
		[steps.title],
	)
	// =======================

	return (
		<BottomSheetView style={[styles.container]}>
			{/* <View style={styles.wrapper}> */}
			{isShowHeader && (
				<Header
					title={title}
					subtitle={subtitle}
					Pagination={<Pagination acitveIndex={steps.active} count={3} />}
					style={styles.header}
				/>
			)}
			{hasCoins && (
				<>
					{steps.title === "Insert Import" && (
						<InsertImport
							controller={controller}
							onPressNext={() => steps.goTo("Select Receiver")}
							onPressBack={close}
							onPressSelectCoin={() => steps.goTo("Select coin")}
						/>
					)}
					{steps.title === "Select Receiver" && (
						<SelectReceiver
							controller={controller}
							onPressBack={goBack}
							onPressRecap={() => steps.goTo("Send Recap")}
							onPressScanner={onPressScanQRReciver}
						/>
					)}
					{steps.title === "Send Recap" && (
						<SendRecap controller={controller} onPressBack={goBack} onPressSend={onPressSend} />
					)}
					{steps.title === "Select coin" && <SelectCoin controller={controller} onBack={goBack} />}
				</>
			)}
			{!hasCoins && (
				<View style={styles.verticallyCentered}>
					<Text style={{ color: COLOR.White }}>No assets available to send</Text>
				</View>
			)}
			{/* </View> */}
		</BottomSheetView>
	)
})

const styles = StyleSheet.create({
	container: { flex: 1 },
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
	header: { marginTop: 10 },

	//
	selectCoin: { marginTop: 15 },
})
