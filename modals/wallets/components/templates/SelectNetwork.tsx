import { useCallback } from "react"
import { StyleSheet, ViewStyle, StyleProp } from "react-native"
import { useStore, useTheme } from "hooks"
import { SupportedCoins } from "constants/Coins"
import { COLOR } from "utils"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { DetailedSelect, Select } from "modals/general/organisms"
import { getAssetSymbol, getCoinIcon, getCoinName, getCoinPrefix } from "core/utils/Coin"
import { t } from "i18next"
import { useTranslation } from "react-i18next"

type Props = {
	title?: string
	description?: string
	activeChain?: string | null
	filter?(chain: string): boolean
	onPress(chain: string): void
	style?: StyleProp<ViewStyle>
}

export default function SelectNetwork({title, description, activeChain, filter, onPress, style }: Props) {
	const { t } = useTranslation()
	const { chains: chainStore } = useStore()
	const theme = useTheme()

	const selectCoin = useCallback(
		(chain) => {
			onPress(chain)
		},
		[onPress],
	)
	const chains = filter ? chainStore.enabledCoins.filter(filter) : chainStore.enabledCoins

	const infoExtractor = (item: SupportedCoins) =>
	{
		return {
			title: getCoinName(item) ?? "",
			description: getAssetSymbol(item),
			uri: getCoinIcon(item),
			subtitle: item == SupportedCoins.BITSONG118 || item == SupportedCoins.BITSONG118_TESTNET ? "(" + t("CosmosCompatible") + ")" : undefined
		}
	}

	return (
		<BottomSheetView style={[styles.container, style]}>
			<DetailedSelect
				title={title ?? t("SelectNetworkTitle")}
				description={description}
				infoExtractor={infoExtractor}
				items={chains}
				active={activeChain}
				hideSelector={true}
				onPress={item => selectCoin(item)}
			/>
		</BottomSheetView>
	)
}

const styles = StyleSheet.create({
	container: { flexGrow: 1 },

	back: {
		marginBottom: 24,
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
		flex: 1,
	},
	flatlistContent: {
		paddingBottom: 40,
	},
})
