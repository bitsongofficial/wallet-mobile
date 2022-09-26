import { Omit, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native"
import ThemedGradient from "./ThemedGradient"
import { useTheme } from "hooks"
import { TouchableOpacity } from "react-native-gesture-handler"
import { s } from "react-native-size-matters"
import { COLOR } from "utils"
import { useCallback } from "react"
import Icon2 from "./Icon2"

type Mode = "gradient" | "fill" | "gradient_border" | "white"
type Size = "thin" | "normal" | number

export type Props = {
	onPress?(): void
	mode?: Mode
	text?: string
	children?: React.ReactNode
	style?: StyleProp<ViewStyle>
	contentContainerStyle?: StyleProp<ViewStyle>
	textStyle?: StyleProp<TextStyle>
	fontSize?: 12 | 16
	size?: Size | {x: Size, y: Size}
	full?: boolean
	disable?: boolean
	Left?: JSX.Element
	Right?: JSX.Element
	textAlignment?: "center" | "left" | "right"
}

const Button = ({
	onPress,
	text,
	children,
	style,
	mode = "gradient",
	contentContainerStyle,
	textStyle,
	fontSize,
	size = "normal",
	disable = false,
	Left,
	Right,
	textAlignment = "left",
}: Props) => {
	const themeStyle = useTheme()
	const Background = mode === "gradient" || mode === "gradient_border" ? ThemedGradient : View
	const actualFontSize = fontSize ?? (size == "thin" ? 12 : 16)
	const getPaddingValue = useCallback((val?: Size, direction: "horizontal" | "vertical" ="horizontal") =>
	{
		if(typeof(val) == "number") return s(val)
		if(val == "thin" && direction == "vertical") return s(8)
		if(val == "thin" && direction == "horizontal") return s(12)
		if(direction == "horizontal") return s(24)
		return s(16)
	}, [])
	const getPaddingStyle = useCallback((size) =>
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
					<View style={[
						styles.content,
						getPaddingStyle(size),
						mode === "gradient_border" && styles.gradientBorderBackground,
						contentContainerStyle,
						!(Left || Right) && textAlignment == "center" ? styles.contentCenter : styles.contentBetween,
					]}>
						{Left}
						{text || typeof children === "string" ? (
							<Text style={[styles.text, themeStyle.text.primary, {fontSize: s(actualFontSize), textAlign: textAlignment}, textStyle]}>
								{text || children}
							</Text>
						) : (
							children
						)}
						{Right}
					</View>
				</Background>
			</View>
		</TouchableOpacity>
	)
}

export default Button

function withChevrolet(ButtonComponent: typeof Button)
{
	return function(props: React.PropsWithChildren<Omit<Props, "Right" | "Left">>)
	{
		return (
			<ButtonComponent
				Right={<Icon2 name="chevron_right_2" stroke={COLOR.White} size={18} />}
				{...props}
			></ButtonComponent>
		)
	}
}

export const ButtonChevroletRight = withChevrolet(Button)

const styles = StyleSheet.create({
	container: {
		borderRadius: s(50),
		overflow: "hidden",
	},
	content: {
		alignItems: "center",
		flexDirection: "row",
		borderRadius: s(50),
	},
	contentBetween: {
		justifyContent: "space-between",
	},
	contentCenter: {
		justifyContent: "space-around",
	},
	border: {
		padding: s(2),
	},
	gradientBorderBackground: {
		backgroundColor: COLOR.Dark3,
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
