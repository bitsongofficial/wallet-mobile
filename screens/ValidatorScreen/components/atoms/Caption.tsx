import { StyleProp, StyleSheet, Text, TextStyle } from "react-native"
import { s } from "react-native-size-matters"
import { COLOR } from "utils"

type Props = {
	text?: string
	children?: React.ReactNode
	style?: StyleProp<TextStyle>
}

export default ({ children, text, style }: Props) => (
	<Text style={[styles.text, style]}>{text || children}</Text>
)

const styles = StyleSheet.create({
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(13),
		lineHeight: s(16),
		color: COLOR.Marengo,
	},
})
