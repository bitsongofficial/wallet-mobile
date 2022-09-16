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

type Props = {
	controller: SendController
	onPressSelectCoin(): void
	style?: StyleProp<ViewStyle>
}

export default observer<Props>(function InsertImport({ controller, onPressSelectCoin, style }) {
	const theme = useTheme()
	const { settings } = useStore()
	const creater: TransactionCreater = controller.creater
	const fiatSymbol = settings.currency?.symbol

	return (
		<View style={style}>
			<View style={styles.row}>
				<Text style={[styles.usd, theme.text.primary]}>
					{controller.readableInput}{" "}
					{controller.inverted ? fiatSymbol : creater.coin?.info.coinName}
				</Text>
				<View>
					<Button
						text="MAX"
						onPress={controller.setMax}
						contentContainerStyle={styles.maxButtonContent}
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
		</View>
	)
})

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 24,
	},
	usd: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 42,
		lineHeight: 53,
	},
	coin: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 8,
	},

	coinBalance: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 21,
		lineHeight: 27,
		color: COLOR.RoyalBlue,
	},
	select: {
		marginTop: 39,
	},

	maxButtonContent: {
		paddingHorizontal: 8,
		paddingVertical: 8,
	},

	numpad: {
		flexGrow: 1,
		justifyContent: "space-around",
		padding: 15,
	},
})
