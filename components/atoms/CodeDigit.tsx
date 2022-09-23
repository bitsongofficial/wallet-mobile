import {
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewStyle,
} from "react-native"
import { useTheme } from "hooks"
import { COLOR } from "utils"
import { s } from "react-native-size-matters"

type ButtonProps = {
	style?: StyleProp<ViewStyle>
	text?: string
	isError?: boolean
}

export default ({ style, text, isError }: ButtonProps) => {
	const theme = useTheme()

	return (
		<View style={style}>
			{text == undefined &&
				<View
					style={[
						styles.placeholder,
						styles.placeholder_fill,
						isError && { backgroundColor: COLOR.Pink },
					]}
				/>
			}
			{text && (
				<Text style={[styles.num, theme.text.primary, isError && { color: COLOR.Pink }]}>
					{text}
				</Text>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	num: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(40),
	},
	placeholder: {
		width: s(6),
		height: s(10),
		borderRadius: s(50),
		backgroundColor: COLOR.White,
		opacity: 0.15,
	},

	placeholder_fill: {
		opacity: 1,
	},
})