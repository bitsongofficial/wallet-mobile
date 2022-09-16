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

type Props = {
	controller: SendController
	onBack(): void
	style?: StyleProp<ViewStyle>
}

export default function SelectCoin({ controller, onBack, style }: Props) {
	const theme = useTheme()
	const { coin } = useStore()

	const selectCoin = useCallback(
		(coin) => {
			controller.creater.setCoin(coin)
			onBack()
		},
		[controller, onBack],
	)
	const coinsFromSupported = Object.values(SupportedCoins).map((sc) => coin.findAssetWithCoin(sc))
	const availableCoins = coinsFromSupported.filter((c) => c != undefined) as Coin[]

	const renderCoin = useCallback<ListRenderItem<Coin>>(
		({ item }) => <ButtonCoinSelect key={item?.info._id} coin={item} onPress={selectCoin} />,
		[],
	)

	return (
		<BottomSheetView style={[styles.container, style]}>
			<ButtonBack onPress={onBack} style={styles.back} />
			<Text style={[styles.title, theme.text.primary]}>Select coin</Text>
			<Text style={styles.caption}>
				Select also the chain where your coin{"\n"}
				come from
			</Text>

			<FlatList
				renderItem={renderCoin}
				data={availableCoins}
				style={styles.flatList}
				contentContainerStyle={styles.flatlistContent}
			/>
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
