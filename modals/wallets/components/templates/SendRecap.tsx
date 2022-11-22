import { useCallback, useEffect, useRef, useState } from "react"
import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetScrollView, BottomSheetScrollViewMethods } from "@gorhom/bottom-sheet"
import { useStore } from "hooks"
import { Tabs, Recap } from "components/organisms"
import { SendController } from "../../controllers"
import { SupportedCoins } from "constants/Coins"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { fromCoinToAmount } from "core/utils/Coin"
import { s } from "react-native-size-matters"
import { useTranslation } from "react-i18next"
import { JSONTree } from "components/Themed"

type ValueTabs = "Details" | "Data"
const tabs: ValueTabs[] = ["Details", "Data"]

type Props = {
	controller: SendController
}

export default observer(function SelectReceiver({ controller }: Props) {
	const { t } = useTranslation()
	const { coin: coinStore } = useStore()

	const [activeTab, setActiveTab] = useState<ValueTabs>("Details")
	const scrollview = useRef<BottomSheetScrollViewMethods>(null)
	const insets = useSafeAreaInsets()

	const [json, setJson] = useState<any>({})

	useEffect(() =>
	{
		(async () =>
		{
			const { coin, addressInput, balance } = controller.creater
			const chain = coin?.info.coin ?? SupportedCoins.BITSONG
			setJson(await coinStore.sendMessage(
				chain,
				addressInput.value,
				fromCoinToAmount(balance, chain)))
		})()
	}, [controller])

	const titleExtractor = useCallback((tab: ValueTabs) =>
	{
		if(tab === "Data") return t("Data")
		if(tab === "Details") return t("Details")
		return ""
	}, [])

	return (
		<View style={styles.container}>
			<Tabs values={tabs} active={activeTab} titleExtractor={titleExtractor} onPress={setActiveTab} style={styles.tabs} />
			{activeTab === "Details" && (
				<BottomSheetScrollView
					ref={scrollview}
					contentContainerStyle={{
						paddingTop: 28,
					}}
				>
					<Recap
						bottomSheet
						style={{ marginTop: 0 }}
						address={controller.creater.address}
						amount={controller.creater.balance.toString()}
						coin={controller.creater.coin?.info}
						onPress={() => {}}
						memoInput={controller.creater.memo}
					/>
				</BottomSheetScrollView>
			)}
			{activeTab === "Data" && (
				<View style={{overflow: "hidden"}}>
					<JSONTree data={json} />
				</View>
			)}
			{/* <Data
				style={{ marginTop: 36, marginBottom: footerInsets }}
				json={JSON.stringify(require("../../../../app.json"), null, 4)}
			/> */}
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
	},
	self: { marginTop: 19 },

	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 21,
		lineHeight: 27,
	},
	caption: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 13,
		lineHeight: 16,
	},
	tabs: {
		marginTop: 29,
		marginBottom: s(6),
	},

	funds: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",

		marginTop: 27,
	},
})
