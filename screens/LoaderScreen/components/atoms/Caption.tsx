import { StyleProp, StyleSheet, Text, TextStyle } from "react-native"
import { s } from "react-native-size-matters"
import { COLOR } from "utils"

type Props = {
	text?: string
	children?: React.ReactNode
	style?: StyleProp<TextStyle>
}

export default ({ children, text, style }: Props) => {
	return <Text style={[styles.text, style]}>{text || children}</Text>
}

const styles = StyleSheet.create({
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		lineHeight: s(20),
		textAlign: "center",
		color: COLOR.Marengo,
	},
})
