import { StyleSheet, ViewStyle, StyleProp, Text, View } from "react-native"
import { s } from "react-native-size-matters"
import { COLOR } from "utils"

type PropsStat = {
	name: string
	persent: string | number
	style?: StyleProp<ViewStyle>
}

export default ({ name, persent, style }: PropsStat) => (
	<View style={[styles.container, style]}>
		<Text style={styles.name}>{name}</Text>
		<Text style={styles.percent}>{persent}%</Text>
	</View>
)

const styles = StyleSheet.create({
	container: { flexDirection: "row", alignItems: "center" },
	name: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(12),
		color: COLOR.RoyalBlue,
		marginRight: s(10),
	},
	percent: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		color: COLOR.White,
	},
})
