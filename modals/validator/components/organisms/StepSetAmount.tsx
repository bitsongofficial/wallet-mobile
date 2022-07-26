import { StyleSheet, Text, View } from "react-native"
import { COLOR } from "utils"
import { Button } from "components/atoms"
import { Numpad } from "components/moleculs"
import { Coin } from "classes"

type Props = {
	onPressNum(num: string): void
	onPressDelNum(): void
	onPressMax(): void
	amount: string
	coin: Coin
}

export default ({ onPressMax, onPressNum, onPressDelNum, amount, coin }: Props) => {
	return (
		<>
			<View>
				<View style={styles.row}>
					<Text style={styles.usd}>{amount || 0}</Text>
					<View>
						<Button
							text="MAX"
							onPress={onPressMax}
							contentContainerStyle={styles.maxButtonContent}
						/>
					</View>
				</View>
				<Text style={styles.avalibale}>Available: {coin.balance} BTSG</Text>
			</View>
			<Numpad style={styles.numpad} onPress={onPressNum} onPressRemove={onPressDelNum} />
		</>
	)
}

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
		color: COLOR.White,
	},
	numpad: {
		flexGrow: 1,
		justifyContent: "space-around",
		padding: 15,
		marginBottom: 35,
	},

	maxButtonContent: {
		paddingHorizontal: 8,
		paddingVertical: 8,
	},

	avalibale: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,
		color: COLOR.RoyalBlue,
	},
})
