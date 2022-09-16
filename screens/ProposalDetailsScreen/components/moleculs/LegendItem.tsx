import { StyleSheet, ViewStyle } from "react-native"
import { StyleProp, Text, View } from "react-native"
import { s } from "react-native-size-matters"
import { COLOR } from "utils"

type LegendProps = {
	color: string
	name: string
	value: string | number
	style?: StyleProp<ViewStyle>
}

export default ({ color, name, value, style }: LegendProps) => (
	<View style={[styles.container, style]}>
		<View style={[{ backgroundColor: color }, styles.dot]} />
		<View style={styles.data}>
			<Text style={styles.text}>{name}</Text>
			<Text style={styles.text}>{value} %</Text>
		</View>
	</View>
)

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: s(12),

		paddingVertical: s(7),
	},
	dot: {
		width: s(10),
		height: s(10),
		borderRadius: s(10),
		marginRight: s(16),
	},
	data: {
		flexDirection: "row",
		justifyContent: "space-between",
		flex: 1,
	},
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		color: COLOR.White,
	},
})
