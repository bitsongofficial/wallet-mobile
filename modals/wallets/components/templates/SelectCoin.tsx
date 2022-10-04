import { useCallback } from "react"
import { StyleSheet, Text, ViewStyle, StyleProp } from "react-native"
import { useStore, useTheme } from "hooks"
import { SupportedCoins } from "constants/Coins"
import { Coin } from "classes"
import { COLOR } from "utils"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { HORIZONTAL_WRAPPER } from "utils/constants"
import { CoinSelect } from "modals/general/organisms"

type Props = {
	activeCoin?: Coin | null
	onPress(coin: Coin): void
	onBack(): void
	style?: StyleProp<ViewStyle>
}

export default function SelectCoin({ activeCoin, onPress, onBack, style }: Props) {
	const { coin } = useStore()

	const selectCoin = useCallback(
		(coin) =>
		{
			onPress(coin)
			onBack()
		},
		[onPress, onBack],
	)
	const coinsFromSupported = Object.values(SupportedCoins).map((sc) => coin.findAssetWithCoin(sc))
	const availableCoins = coinsFromSupported.filter((c) => c != undefined) as Coin[]

	return (
		<BottomSheetView style={[styles.container, style]}>
			<CoinSelect
				coins={availableCoins}
				onPress={selectCoin}
				active={activeCoin ? activeCoin : undefined}
			></CoinSelect>
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
