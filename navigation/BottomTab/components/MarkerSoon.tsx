import { View, Text, StyleSheet } from "react-native"
import { s } from "react-native-size-matters"
import { COLOR } from "utils"

export default () => (
	<View style={styles.container}>
		<Text style={styles.text}>SOON</Text>
	</View>
)

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLOR.White,
		position: "absolute",

		width: s(28),
		borderRadius: s(25),
		left: s(18),

		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		flex: 1,
		paddingHorizontal: s(4),
		paddingVertical: s(2),
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(6),
		lineHeight: s(8),
		textAlign: "center",
		textAlignVertical: "center",
	},
})
