import { useCallback } from "react"
import { ListRenderItem, StyleSheet, Text, ViewStyle, StyleProp } from "react-native"
import { useStore, useTheme } from "hooks"
import { ButtonBack } from "components/atoms"
import { SupportedCoins } from "constants/Coins"
import { Coin } from "classes"
import { COLOR } from "utils"
import { FlatList } from "react-native-gesture-handler"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { SendController } from "../../controllers"
import { ButtonCoinSelect } from "../moleculs"
import { HORIZONTAL_WRAPPER } from "utils/constants"
import { Select } from "modals/general/organisms"

type Props = {
	activeCoin?: Coin | null
	onPress(coin: Coin): void
	onBack(): void
	style?: StyleProp<ViewStyle>
}

export default function SelectCoin({ activeCoin, onPress, onBack, style }: Props) {
	const theme = useTheme()
	const { coin } = useStore()

	const selectCoin = useCallback(
		(coin) => {
			onPress(coin)
			onBack()
		},
		[onPress, onBack],
	)
	const coinsFromSupported = Object.values(SupportedCoins).map((sc) => coin.findAssetWithCoin(sc))
	const availableCoins = coinsFromSupported.filter((c) => c != undefined) as Coin[]

	return (
		<BottomSheetView style={[styles.container, style]}>
			<Select
				title="Select coin"
				description={"Select also the chain where your coin\ncome from"}
				labelExtractor={(item) => item.info.brand}
				items={availableCoins}
				active={activeCoin}
				onPress={selectCoin}
				// searchCriteria={(item, search) => item.info.brand.toLowerCase().includes(search.toLowerCase())}
				rightExtractor={item => <Text style={[{fontWeight: "bold"}, theme.text.colorText]}>{item.balance + " " + item.info.coinName}</Text>}
			></Select>
		</BottomSheetView>
	)
}

const styles = StyleSheet.create({
	container: { flexGrow: 1 },

	back: {
		marginBottom: 24,
		marginHorizontal: HORIZONTAL_WRAPPER,
	},
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 20,
		lineHeight: 25,

		textAlign: "center",
		marginBottom: 8,
	},
	caption: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,

		color: COLOR.Marengo,
		textAlign: "center",
	},

	flatList: {
		marginHorizontal: HORIZONTAL_WRAPPER / 2,
		flex: 1,
	},
	flatlistContent: {
		paddingBottom: 40,
		paddingHorizontal: HORIZONTAL_WRAPPER / 2,
	},
})
