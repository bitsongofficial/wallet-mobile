import {
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	ViewStyle,
} from "react-native"
import { s, vs } from "react-native-size-matters"
import { View } from "components/Themed"
import { COLOR } from "utils"
import { useCallback, useMemo } from "react"

type Size = 16 | 20 | 24 | 32 | 42

type Props = {
	style?: StyleProp<ViewStyle>
	title?: string
	uppertitle?: string
	subtitle?: string
	titleStyle?: StyleProp<TextStyle>
	uppertitleStyle?: StyleProp<TextStyle>
	subtitleStyle?: StyleProp<TextStyle>
	size?: Size | {uppertitle?: Size, title?: Size, subtitle?: Size}
}

export default ({
	style,
	title,
	subtitle,
	uppertitle,
	titleStyle,
	subtitleStyle,
	uppertitleStyle,
	size,
	children
}: React.PropsWithChildren<Props>) =>
{
	const toFontSize = useCallback((size: number) =>
	{
		if(size) return {
			fontSize: s(size),
			lineHeight: s(size + 6),
		}
		return {
			fontSize: s(24),
			lineHeight: s(30),
		}
	}, [])
	const getFontSizes = useCallback((size) =>
	{
		const actualSize = size ?? 24
		if(typeof(actualSize) == "object") return {
			uppertitle: toFontSize(actualSize.uppertitle),
			subtitle: toFontSize(actualSize.subtitle),
			title: toFontSize(actualSize.title)
		}
		return {
			uppertitle: toFontSize(actualSize - 4),
			subtitle: toFontSize(actualSize - 8),
			title: toFontSize(actualSize)
		}
	}, [])
	const sizes = useMemo(() => getFontSizes(size), [size])
	return (
		<View style={[styles.container, style]}>
			{uppertitle && <Text style={[styles.uppertitle, uppertitleStyle, sizes.uppertitle]}>{uppertitle}</Text>}
			<Text style={[styles.title, titleStyle, sizes.title, subtitle ? styles.titleMarginBottom : undefined]}>
				{children ?? title}
			</Text>
			{subtitle && <Text style={[styles.subtitle, subtitleStyle, sizes.subtitle]}>{subtitle}</Text>}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "transparent",
	},
	uppertitle: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "400",
		color: COLOR.RoyalBlue2,

		marginBottom: vs(10),
	},
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		color: COLOR.White,
	},
	titleMarginBottom: {
		marginBottom: vs(6),
	},
	subtitle: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		color: COLOR.White,
		opacity: 0.5,
	},
})
