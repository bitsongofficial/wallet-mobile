import { useCallback } from "react"
import { StyleSheet, Text, ViewStyle, StyleProp } from "react-native"
import { useStore, useTheme } from "hooks"
import { Coin } from "classes"
import { COLOR } from "utils"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { HORIZONTAL_WRAPPER } from "utils/constants"
import { CoinSelect, CoinSelectProps } from "modals/general/organisms"

type Props = {
	activeCoin?: Coin | null
	onPress(coin: Coin): void
	style?: StyleProp<ViewStyle>
	filter?(coin: Coin): boolean
	coins?: Coin[]
} & CoinSelectProps

export default function SelectCoin({ coins, activeCoin, onPress, filter, style, ...props }: Props) {
	const { coin } = useStore()

	const selectCoin = useCallback(
		(coin) =>
		{
			onPress(coin)
		},
		[onPress],
	)
	const baseCoins = coins ?? coin.coins
	const nonZeroCoins = baseCoins.filter(c => c.balance > 0)
	const availableCoins = filter ? nonZeroCoins.filter(filter) : nonZeroCoins

	return (
		<BottomSheetView style={[styles.container, style]}>
			<CoinSelect
				coins={availableCoins}
				onPress={selectCoin}
				active={activeCoin ? activeCoin : undefined}
				{...props}
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
