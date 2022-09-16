import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { s } from "react-native-size-matters"
import { FOOTER_HEIGHT } from "utils/constants"

type Props = {
	Right?: JSX.Element | boolean
	Center?: JSX.Element | boolean
	Left?: JSX.Element | boolean
	style?: StyleProp<ViewStyle>
}

export default ({ Center, Left, Right, style }: Props) => (
	<View style={[styles.container, style]}>
		<View style={styles.left}>{Left}</View>
		<View style={styles.center}>{Center}</View>
		<View style={styles.right}>{Right}</View>
	</View>
)

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		marginHorizontal: s(30), // TODO: Standart Wrapper, need constant
		height: FOOTER_HEIGHT,
		alignItems: "center",
		justifyContent: "space-between",
	},
	left: {
		position: "absolute",
		left: 0,
		zIndex: 1,
		alignItems: "center",
	},
	center: {
		...StyleSheet.absoluteFillObject,
		flexDirection: "row",
		alignItems: "center",

		justifyContent: "center",
	},
	right: {
		position: "absolute",
		right: 0,
		zIndex: 1,
		alignItems: "center",
	},
})
