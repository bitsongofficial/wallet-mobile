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
import { DetailedSelect, Select } from "modals/general/organisms"
import { getCoinIcon, getCoinName } from "core/utils/Coin"
import { t } from "i18next"

type Props = {
	title?: string
	description?: string
	activeChain?: SupportedCoins | null
	onPress(chain: SupportedCoins): void
	style?: StyleProp<ViewStyle>
}

export default function SelectCoin({title, description, activeChain, onPress, style }: Props) {
	const theme = useTheme()

	const selectCoin = useCallback(
		(chain) => {
			onPress(chain)
		},
		[onPress],
	)
	const chains = Object.values(SupportedCoins)

	const infoExtractor = (item: SupportedCoins) =>
	{
		return {
			title: getCoinName(item),
			description: item.toString(),
			uri: getCoinIcon(item),
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
