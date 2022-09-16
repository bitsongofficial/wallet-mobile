import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native"
import ThemedGradient from "./ThemedGradient"
import { useTheme } from "hooks"
import { TouchableOpacity } from "react-native-gesture-handler"
import { s } from "react-native-size-matters"

type Mode = "gradient" | "fill" | "gradient_border"

export type ButtonProps = {
	onPress?(): void
	mode?: Mode
	text?: string
	children?: React.ReactNode
	style?: StyleProp<ViewStyle>
	contentContainerStyle?: StyleProp<ViewStyle>
	textStyle?: StyleProp<TextStyle>
	disable?: boolean
	Left?: JSX.Element
	Right?: JSX.Element
}

export default ({
	onPress,
	text,
	children,
	style,
	mode = "gradient",
	contentContainerStyle,
	textStyle,
	disable,
	Left,
	Right,
}: ButtonProps) => {
	const themeStyle = useTheme()
	const Background = mode === "gradient" || mode === "gradient_border" ? ThemedGradient : View

	return (
		<TouchableOpacity onPress={!disable ? onPress : undefined} disabled={disable}>
			<View style={[styles.container, style, disable && styles.disable]}>
				<Background style={mode === "gradient_border" && styles.border}>
					<View style={[styles.content, contentContainerStyle]}>
						{!!Left && Left}
						{text || typeof children === "string" ? (
							<Text style={[styles.text, themeStyle.text.primary, textStyle]}>
								{text || children}
							</Text>
						) : (
							children
						)}
						{!!Right && Right}
					</View>
				</Background>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		borderRadius: s(50),
		overflow: "hidden",
	},
	content: {
		paddingVertical: s(9),
		paddingHorizontal: s(24),
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		borderRadius: s(50),
	},
	border: {
		padding: s(2),
	},
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(11),
	},
	disable: {
		opacity: 0.5,
	},
})
