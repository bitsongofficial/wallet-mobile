import { StyleSheet, Text, View, ViewStyle } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { observer } from "mobx-react-lite"
import { COLOR } from "utils"
import { useStore, useTheme } from "hooks"
import { Button, Icon2 } from "components/atoms"
import { Numpad } from "components/moleculs"
import { SendController } from "../../controllers"
import { CardSelectCoin } from "../moleculs"
import { TransactionCreater } from "classes/Transaction"
import { StyleProp } from "react-native"
import { mvs, s, vs } from "react-native-size-matters"
import { BottomSheetView } from "@gorhom/bottom-sheet"
import { FOOTER_HEIGHT } from "utils/constants"

type Props = {
	controller: SendController
	onPressSelectCoin(): void
	style?: StyleProp<ViewStyle>
}

export default observer<Props>(function InsertImport({ controller, onPressSelectCoin, style }) {
	const theme = useTheme()
	const { settings } = useStore()
	const creater: TransactionCreater = controller.creater
	const fiatSymbol = settings.prettyCurrency?.symbol

	return (
		<BottomSheetView style={[styles.container, style]}>
			<View style={styles.row}>
				<Text style={[styles.usd, theme.text.primary]}>
					{controller.readableInput}{" "}
					<Text style={!controller.inverted && {fontSize: s(24)}}>{controller.inverted ? fiatSymbol : creater.coin?.info.coinName}</Text>
				</Text>
				<View>
					<Button
						text="MAX"
						onPress={controller.setMax}
						contentContainerStyle={styles.maxButtonContent}
						size="thin"
					/>
				</View>
			</View>

			{creater.coin && (
				<View style={styles.coin}>
					<Text style={styles.coinBalance}>
						{(controller.inverted ? controller.balance : controller.fiat) || 0}{" "}
						{controller.inverted ? creater.coin?.info.coinName : fiatSymbol}
					</Text>
					<Icon2 name="upNdown" size={18} stroke={COLOR.RoyalBlue} onPress={controller.invert} />
				</View>
			)}

			<TouchableOpacity onPress={onPressSelectCoin}>
				<CardSelectCoin coin={creater.coin} style={styles.select} />
			</TouchableOpacity>

			<Numpad
				onPress={controller.addNumber}
				onPressRemove={controller.removeNumber}
				style={styles.numpad}
			/>
		</BottomSheetView>
	)
})

const styles = StyleSheet.create({
	container: {},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: mvs(24, 1.5),
	},
	usd: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: mvs(42, 1.5),
		lineHeight: mvs(53, 1.5),
	},
	coin: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: mvs(8, 0.1),
	},

	coinBalance: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: mvs(19, 1.5),
		lineHeight: mvs(24, 1.5),
		color: COLOR.RoyalBlue,
		marginLeft: s(3),
	},
	select: {
		marginTop: mvs(39, 1.5),
	},

	maxButtonContent: {
		paddingHorizontal: mvs(8, 1.5),
		paddingVertical: mvs(8, 1.5),
	},

	numpad: {
		marginBottom: FOOTER_HEIGHT,
	},
})
