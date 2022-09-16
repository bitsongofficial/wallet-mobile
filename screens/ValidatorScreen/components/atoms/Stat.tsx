import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { s } from "react-native-size-matters"
import { COLOR } from "utils"
import Caption from "./Caption"

type Props = {
	title: string
	value: string | number
	style?: StyleProp<ViewStyle>
}

export default ({ title, value, style }: Props) => (
	<View style={[styles.container, style]}>
		<Caption style={styles.count}>{title}</Caption>
		<Text style={styles.value}>{value}</Text>
	</View>
)

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	count: {
		fontSize: s(14),
		lineHeight: s(18),
	},
	value: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		lineHeight: s(20),
		color: COLOR.White,
	},
})
