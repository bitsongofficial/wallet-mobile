import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { s } from "react-native-size-matters"
import { COLOR } from "utils"

type Props = {
	value: string | number
	coinName: string
	style?: StyleProp<ViewStyle>
}

export default ({ coinName, value, style }: Props) => (
	<View style={[styles.container, style]}>
		<Text style={styles.count}>{value}</Text>
		<Text style={styles.coinName}>{coinName.toUpperCase()}</Text>
	</View>
)

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "flex-end",
	},
	count: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(24),
		color: COLOR.White,

		marginRight: s(7),
	},
	coinName: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		color: COLOR.RoyalBlue5,
	},
})
