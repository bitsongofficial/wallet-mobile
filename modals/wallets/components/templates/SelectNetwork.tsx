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
import { getCoinName } from "core/utils/Coin"

type Props = {
	title?: string
	activeChain?: SupportedCoins | null
	onPress(chain: SupportedCoins): void
	style?: StyleProp<ViewStyle>
}

export default function SelectCoin({ activeChain, onPress, style }: Props) {
	const theme = useTheme()

	const selectCoin = useCallback(
		(chain) => {
			onPress(chain)
		},
		[onPress],
	)
	const chains = Object.values(SupportedCoins).map((c: SupportedCoins) => ({chain: c, name: getCoinName(c)}))

	return (
		<BottomSheetView style={[styles.container, style]}>
			<Select
				title={"Select network"}
				description={"Select the chain you want to show the address for"}
				labelExtractor={(item) => item.name}
				items={chains}
				hideSelector={true}
				onPress={item => selectCoin(item.chain)}
				// searchCriteria={(item, search) => item.info.brand.toLowerCase().includes(search.toLowerCase())}
				rightExtractor={item => <Text style={[{fontWeight: "bold"}, theme.text.colorText]}>{item.chain.toUpperCase()}</Text>}
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
