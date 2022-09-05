import { StyleProp, StyleSheet, Text, TextStyle } from "react-native"
import { useTheme } from "hooks"
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
		fontWeight: "400",
		fontSize: 14,
		lineHeight: 18,

		color: COLOR.Marengo,
	},
})
