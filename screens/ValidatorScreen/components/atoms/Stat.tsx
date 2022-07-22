import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { COLOR } from "utils"
import Caption from "./Caption"

type Props = {
	title: string
	value: string | number
	style?: StyleProp<ViewStyle>
}

export default ({ title, value, style }: Props) => {
	return (
		<View style={[styles.container, style]}>
			<Caption style={styles.count}>{title}</Caption>
			<Text style={styles.value}>{value}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	count: {
		fontSize: 14,
		lineHeight: 18,
	},
	value: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,
		color: COLOR.White,
	},
})
