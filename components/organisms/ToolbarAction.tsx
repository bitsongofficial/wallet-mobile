import { memo, ReactNode } from "react"
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import ThemedGradient from "components/atoms/ThemedGradient"
import { COLOR, hexAlpha } from "utils"

type Mode = "gradient" | "fill"

type Props = {
	onPress?(): void
	Icon?: JSX.Element
	title?: string
	size?: number
	mode?: Mode

	nullContent?: boolean

	style?: StyleProp<ViewStyle>
	buttonStyle?: StyleProp<ViewStyle>
	iconContainerStyle?: StyleProp<ViewStyle>
	textStyle?: StyleProp<ViewStyle>
	backgroundStyle?: StyleProp<ViewStyle>
}

export default memo(
	({
		Icon,
		onPress,
		title,
		size = 52,
		mode = "fill",

		nullContent,

		style,
		buttonStyle,
		textStyle,
		iconContainerStyle,
		backgroundStyle,
	}: Props) => {
		const sizeStyle: ViewStyle = {
			width: size,
			height: size,
		}

		const Background = mode === "gradient" ? ThemedGradient : View
		const itemStyles = [styles.container, style]
		if (onPress == undefined) itemStyles.push(styles.disabled)
		return (
			<View style={itemStyles}>
				{nullContent ? (
					<>
						<View style={[styles.button, sizeStyle]} />
						<View style={{ height: styles.text.lineHeight }} />
					</>
				) : (
					<>
						<TouchableOpacity onPress={onPress} disabled={onPress == undefined}>
							<View style={[styles.button, sizeStyle, buttonStyle]}>
								<Background
									style={[styles.gradient, mode === "fill" && styles.fill_color, backgroundStyle]}
								>
									<View style={[styles.gradient_inner, iconContainerStyle]}>{Icon}</View>
								</Background>
							</View>
						</TouchableOpacity>
						<Text style={[styles.text, textStyle]}>{title}</Text>
					</>
				)}
			</View>
		)
	},
)

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "red",
	},
	disabled: {
		opacity: 0.2,
	},
	button: {
		marginBottom: 16,
		borderRadius: 50,
		overflow: "hidden",
	},

	fill_color: {
		backgroundColor: hexAlpha(COLOR.White, 10),
	},
	gradient: {
		width: "100%",
		height: "100%",
		padding: 2,
	},
	gradient_inner: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 50,
	},
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 13,
		lineHeight: 16,
		color: COLOR.White,
	},
})
