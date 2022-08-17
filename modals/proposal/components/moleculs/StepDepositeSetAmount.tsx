import { StyleSheet, Text, View } from "react-native"
import { COLOR } from "utils"
import { Coin } from "classes"
import { Numpad } from "components/moleculs"
import { Button } from "components/atoms"

type Props = {
	onPressNum(num: string): void
	onPressDelNum(): void
	onPressMax(): void
	amount: string
	coin: Coin
	min?: string | number | null
}

export default ({ onPressMax, onPressNum, onPressDelNum, amount, coin, min }: Props) => {
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
				<View style={{ flexDirection: "row" }}>
					{min && (
						<>
							<Text style={[styles.avalibale, { marginRight: 11 }]}>Minimum Deposit</Text>
							<Text style={styles.avalibale}>{min} BTSG</Text>
						</>
					)}
				</View>
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
