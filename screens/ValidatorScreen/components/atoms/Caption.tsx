import { StyleProp, StyleSheet, Text, TextStyle } from "react-native"
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
		fontSize: 13,
		lineHeight: 16,
		color: COLOR.Marengo,
	},
})
