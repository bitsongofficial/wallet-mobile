import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native"
import { s } from "react-native-size-matters"
import { COLOR } from "utils"
import { Caption, Card } from "../atoms"

type Props = {
	style: StyleProp<ViewStyle>
	title: string
	value: string
}

export default ({ style, title, value }: Props) => {
	return (
		<Card style={[styles.container, style]}>
			<Caption style={styles.caption}>{title}</Caption>
			<Text style={styles.text}>{value}</Text>
		</Card>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: s(24),
		justifyContent: "space-between",
	},
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(24),
		lineHeight: s(30),
		color: COLOR.White,
	},
	caption: {
		marginBottom: 10,
	},
})
