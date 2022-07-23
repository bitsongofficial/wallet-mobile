import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"

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
		marginHorizontal: 30,
		height: 56,
		alignItems: "center",
		justifyContent: "space-between",
	},
	left: { position: "absolute", left: 0, zIndex: 1 },
	center: {
		...StyleSheet.absoluteFillObject,
		flexDirection: "row",
		justifyContent: "center",
	},
	right: { position: "absolute", right: 0, zIndex: 1 },
})
