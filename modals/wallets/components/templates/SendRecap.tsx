import { useRef, useState } from "react"
import { StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetScrollView, BottomSheetScrollViewMethods } from "@gorhom/bottom-sheet"
import { useStore } from "hooks"
import { Tabs, Recap } from "components/organisms"
import { SendController } from "../../controllers"
import { Data } from "../organisms"
import { SupportedCoins } from "constants/Coins"
import { formatNumber } from "utils/numbers"
import { HORIZONTAL_WRAPPER } from "modals/wallets/constants"
import { FOOTER_HEIGHT } from "components/atoms"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type ValueTabs = "Details" | "Data"
const tabs: ValueTabs[] = ["Details", "Data"]

type Props = {
	controller: SendController
}

export default observer(function SelectReceiver({ controller }: Props) {
	const { coin } = useStore()

	const [activeTab, setActiveTab] = useState<ValueTabs>("Details")
	const scrollview = useRef<BottomSheetScrollViewMethods>(null)
	const insets = useSafeAreaInsets()

	const footerInsets = FOOTER_HEIGHT + 24 + insets.bottom

	return (
		<View style={styles.container}>
			<Tabs values={tabs} active={activeTab} onPress={setActiveTab} style={styles.tabs} />
			{activeTab === "Details" && (
				<BottomSheetScrollView
					ref={scrollview}
					style={{ marginTop: 6 }}
					contentContainerStyle={{
						paddingTop: 28,
						paddingBottom: footerInsets,
					}}
				>
					<Recap
						bottomSheet
						style={{ marginTop: 0 }}
						address={controller.creater.address}
						amount={formatNumber(
							coin.fromCoinBalanceToFiat(
								controller.creater.balance,
								controller.creater.coin?.info.coin ?? SupportedCoins.BITSONG,
							),
						)}
						coin={controller.creater.coin?.info}
						onPress={() => {}}
						memoInput={controller.creater.memo}
					/>
				</BottomSheetScrollView>
			)}
			{activeTab === "Data" && (
				<Data
					style={{ marginTop: 36, marginBottom: footerInsets }}
					json={JSON.stringify(require("../../../../app.json"), null, 4)}
				/>
			)}
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,

		marginHorizontal: HORIZONTAL_WRAPPER,
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
	},

	funds: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",

		marginTop: 27,
	},
})
