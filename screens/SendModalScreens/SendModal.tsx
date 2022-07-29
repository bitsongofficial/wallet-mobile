import { useCallback, useEffect, useMemo } from "react"
import { BackHandler, StyleSheet, Text, View } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useStore } from "hooks"
import { RootStackParamList } from "types"
import { Pagination } from "components/moleculs"
import { SendController } from "./classes"
import { Header } from "./components/atoms"
import { InsertImport, SendRecap, SelectReceiver, SelectCoin } from "./components/templates"
import { COLOR } from "utils"
import { toJS } from "mobx"

type Props = {
	close(): void
	navigation: NativeStackNavigationProp<RootStackParamList>
	controller: SendController
	onPressScanQRReciver(): void
}

export default observer<Props>(function SendModal({
	close,
	navigation,
	controller,
	onPressScanQRReciver,
}) {
	const store = useStore()

	const hasCoins = store.coin.coins.length > 0

	const steps = hasCoins
		? controller.steps
		: { title: "No available assets", goBack: close, active: 0, goTo: () => {} }

	const creater = hasCoins
		? controller.creater
		: { coin: undefined, addressInput: undefined, balance: undefined, }

	const goBack = useCallback(
		() => (steps.title === "Insert Import" ? close() : steps.goBack()),
		[steps, close],
	)
	const send = () => {
		const { coin, addressInput, balance } = creater
		if (coin && addressInput && balance) {
			navigation.push("Loader", {
				// @ts-ignore
				callback: async () => {
					// await wait(2000); // for example
					await store.coin.sendCoin(coin.info.coin, addressInput.value, balance)
				},
			})
		}
		close()
	}

	useEffect(() => {
		const handler = BackHandler.addEventListener("hardwareBackPress", () => {
			goBack()
			return true
		})
		return () => handler.remove()
	}, [goBack])

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
			<View style={styles.wrapper}>
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
							<SendRecap controller={controller} onPressBack={goBack} onPressSend={send} />
						)}
						{steps.title === "Select coin" && (
							<SelectCoin controller={controller} onBack={goBack} />
						)}
					</>
				)}
				{!hasCoins && (
					<View style={styles.verticallyCentered}>
						<Text style={{ color: COLOR.White }}>No assets available to send</Text>
					</View>
				)}
			</View>
		</BottomSheetView>
	)
})

const styles = StyleSheet.create({
	container: { flexGrow: 1 },
	wrapper: {
		marginHorizontal: 30,
		flex: 1,
	},
	verticallyCentered: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	header: { marginTop: 10 },
})
