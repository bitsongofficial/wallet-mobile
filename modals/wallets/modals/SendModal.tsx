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
import { HORIZONTAL_WRAPPER } from "../constants"

type Props = {
	close(): void
	controller: SendController
	onPressSend(): void
	onPressScanQRReciver(): void
	onPressBack(): void
}

export default observer<Props>(function SendModal({
	close,
	controller,
	onPressScanQRReciver,
	onPressSend,
	onPressBack,
}) {
	const store = useStore()
	const hasCoins = toJS(store.coin.coins).length > 0

	const steps = hasCoins
		? controller.steps
		: { title: "No available assets", goBack: close, active: 0, goTo: () => {} }

	const creater = hasCoins
		? controller.creater
		: { coin: undefined, addressInput: undefined, balance: undefined }

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
							onPressBack={onPressBack}
							onPressSelectCoin={() => steps.goTo("Select coin")}
							style={styles.insertImport}
						/>
					)}
					{steps.title === "Select Receiver" && (
						<SelectReceiver
							controller={controller}
							onPressBack={onPressBack}
							onPressRecap={() => steps.goTo("Send Recap")}
							onPressScanner={onPressScanQRReciver}
							style={styles.selectReceiver}
						/>
					)}
					{steps.title === "Send Recap" && (
						<SendRecap
							controller={controller}
							onPressBack={onPressBack}
							onPressSend={onPressSend}
						/>
					)}
					{steps.title === "Select coin" && (
						<SelectCoin controller={controller} onBack={onPressBack} />
					)}
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
	header: { marginTop: 10, marginHorizontal: HORIZONTAL_WRAPPER },
	//
	selectCoin: { marginTop: 15 },
	insertImport: { marginHorizontal: HORIZONTAL_WRAPPER },
	selectReceiver: {
		flex: 1,
	},
})
