import { StyleSheet, View, Text } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomSheetHeader } from "components/moleculs"
import { COLOR } from "utils"

type Props = {
	amount: string | number
	coinName: string
}

export default observer<Props>(({ amount, coinName }) => {
	return (
		<View style={styles.container}>
			<BottomSheetHeader title="Claim Import" subtitle="Amount" />

			<View style={styles.value}>
				<Text style={styles.amount}>{(typeof amount == "number") ? amount.toFixed(2) : amount|| 0}</Text>
				<Text style={styles.coinName}>{coinName}</Text>
			</View>
		</View>
	)
})

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 30,
		flex: 1,
		paddingTop: 25,
	},

	value: {
		flexDirection: "row",
		marginTop: 24,
		alignItems: "flex-end",
	},

	amount: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 42,
		lineHeight: 53,
		color: COLOR.White,

		marginRight: 18,
	},
	coinName: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 18,
		lineHeight: 23,
		color: COLOR.RoyalBlue5,
		marginBottom: 7,
	},
})
