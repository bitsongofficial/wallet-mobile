import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native"
import ThemedGradient from "./ThemedGradient"
import { useTheme } from "hooks"
import { TouchableOpacity } from "react-native-gesture-handler"
import { s } from "react-native-size-matters"
import { COLOR } from "utils"
import { useCallback } from "react"

type Mode = "gradient" | "fill" | "gradient_border" | "white"
type Size = "thin" | "normal" | number

export type ButtonProps = {
	onPress?(): void
	mode?: Mode
	text?: string
	children?: React.ReactNode
	style?: StyleProp<ViewStyle>
	contentContainerStyle?: StyleProp<ViewStyle>
	textStyle?: StyleProp<TextStyle>
	fontSize: 12 | 16
	size?: Size | {x: Size, y: Size}
	full?: boolean
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
	fontSize = 16,
	size = "normal",
	disable,
	Left,
	Right,
}: ButtonProps) => {
	const themeStyle = useTheme()
	const Background = mode === "gradient" || mode === "gradient_border" ? ThemedGradient : View
	const getPaddingValue = useCallback((val?: Size, direction: "horizontal" | "vertical" ="horizontal") =>
	{
		if(typeof(val) == "number") return s(val)
		if(val == "thin") return s(8)
		if(direction == "horizontal") return s(24)
		return s(16)
	}, [])
	const getPaddingStyle = useCallback(() =>
	{
		if(size && typeof(size) != "object") return {paddingHorizontal: getPaddingValue(size), paddingVertical: getPaddingValue(size, "vertical")}
		if(size && typeof(size) != "number") return {
			paddingHorizontal: getPaddingValue(size.x),
			paddingVertical: getPaddingValue(size.y)
		}
		return undefined
	}, [])

	return (
		<TouchableOpacity onPress={!disable ? onPress : undefined} disabled={disable}>
			<View style={[styles.container, style, disable && styles.disable]}>
				<Background style={[mode === "gradient_border" && styles.border, mode === "white" && {backgroundColor: COLOR.White}]}>
					<View style={[styles.content, getPaddingStyle(), contentContainerStyle]}>
						{!!Left && Left}
						{text || typeof children === "string" ? (
							<Text style={[styles.text, themeStyle.text.primary, {fontSize: s(fontSize)}, textStyle]}>
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
