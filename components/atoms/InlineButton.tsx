import {
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from "react-native"
import { useTheme } from "hooks"
import Icon2 from "./Icon2"
import { COLOR } from "utils"
import { s } from "react-native-size-matters"

type ButtonProps = {
	onPress?(): void
	style?: StyleProp<ViewStyle>
	text?: string
	stroke?: string
	textStyle?: StyleProp<TextStyle>
	Left?: JSX.Element
	Right?: JSX.Element
}

export default ({ onPress, style, text, textStyle, stroke, Left, Right }: ButtonProps) => {
	const theme = useTheme()

	return (
		<View style={[styles.container, style]}>
			<TouchableOpacity onPress={onPress}>
				<View style={styles.inner}>
					{Left}
					<Text style={[styles.text, theme.text.primary, textStyle]}>{text}</Text>
					{Right}
				</View>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {},
	inner: {
		flexDirection: "row",
		alignItems: "center",
	},
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		lineHeight: s(20),
		marginLeft: s(4),
	},
})