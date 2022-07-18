import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native"
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
			<Caption>{title}</Caption>
			<Text style={styles.text}>{value}</Text>
		</Card>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 24,
		height: 146,
		width: 130,

		justifyContent: "space-between",
	},
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 24,
		lineHeight: 30,
		color: COLOR.White,
	},
})
