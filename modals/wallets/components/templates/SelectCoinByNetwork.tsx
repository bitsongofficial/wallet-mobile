import { useCallback } from "react"
import { StyleSheet, Text, ViewStyle, StyleProp } from "react-native"
import { useStore, useTheme } from "hooks"
import { Coin } from "classes"
import { COLOR } from "utils"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { HORIZONTAL_WRAPPER } from "utils/constants"
import { CoinSelectProps } from "modals/general/organisms"
import CoinChainSelect from "modals/general/organisms/CoinChainSelect"
import { AssetBalance } from "stores/models/AssetBalance"

type Props = {
	activeChain?: string | null
	onPress(asset: AssetBalance): void
	style?: StyleProp<ViewStyle>
	filter?(asset: AssetBalance): boolean
	assets?: AssetBalance[]
} & CoinSelectProps

export default function SelectAssetByNetwork({ assets, activeChain, onPress, filter, style, ...props }: Props) {
	const { coin } = useStore()

	const selectCoin = useCallback(
		(coin) =>
		{
			onPress(coin)
		},
		[onPress],
	)
	const baseAssets = assets ?? coin.balance
	const nonZeroAssets = baseAssets.filter(c => c.balance > 0)
	const availableAssets = filter ? nonZeroAssets.filter(filter) : nonZeroAssets

	return (
		<BottomSheetView style={[styles.container, style]}>
			<CoinChainSelect
				assets={availableAssets}
				onPress={selectCoin}
				{...props}
			></CoinChainSelect>
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
