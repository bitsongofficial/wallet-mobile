import { memo, ReactNode } from "react"
import {
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from "react-native"
import ThemedGradient from "components/atoms/ThemedGradient"
import { COLOR, hexAlpha } from "utils"
import { s } from "react-native-size-matters"

type Mode = "gradient" | "fill" | "outline"

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
	textStyle?: StyleProp<TextStyle>
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
			width: s(size),
			height: s(size),
		}

		const Background = mode !== "fill" ? ThemedGradient : View
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
									<View style={[styles.gradient_inner, mode === "outline" && styles.outline, iconContainerStyle]}>{Icon}</View>
								</Background>
							</View>
						</TouchableOpacity>
						{title && <Text style={[styles.text, textStyle]}>{title}</Text>}
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
	},
	disabled: {
		opacity: 0.2,
	},
	button: {
		marginBottom: s(10),
		borderRadius: s(50),
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
		borderRadius: s(50),
	},
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(13),
		lineHeight: s(16),
		color: COLOR.White,
	},
	outline: {
		backgroundColor: COLOR.Dark3,
	},
})
