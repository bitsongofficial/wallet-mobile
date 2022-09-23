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

type Size = 16 | 20 | 24 | 42

type Props = {
	style?: StyleProp<ViewStyle>
	title: string
	uppertitle?: string
	subtitle?: string
	titleStyle?: StyleProp<TextStyle>
	uppertitleStyle?: StyleProp<TextStyle>
	subtitleStyle?: StyleProp<TextStyle>
	size: Size | {uppertitle: Size, title: Size, subtitle: Size}
}

export default ({ style, title, subtitle, uppertitle, titleStyle, subtitleStyle, uppertitleStyle, size }: Props) => {
	const toFontSize = useCallback((size: number) =>
	{
		return {
			fontSize: s(size)
		}
	}, [])
	const getFontSizes = useCallback((size) =>
	{
		if(typeof(size) == "object") return {
			uppertitle: toFontSize(size.uppertitle),
			subtitle: toFontSize(size.subtitle),
			title: toFontSize(size.title)
		}
		return {
			uppertitle: toFontSize(size - 4),
			subtitle: toFontSize(size - 8),
			title: toFontSize(size)
		}
	}, [])
	const sizes = useMemo(() => getFontSizes(size), [size])
	return (
		<View style={[styles.container, style]}>
			{uppertitle && <Text style={[styles.uppertitle, uppertitleStyle, sizes.uppertitle]}>{uppertitle}</Text>}
			<Text style={[styles.title, titleStyle, sizes.title]}>
				{title}
			</Text>
			{subtitle && <Text style={[styles.subtitle, subtitleStyle, sizes.subtitle]}>{subtitle}</Text>}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginBottom: vs(34),
	},
	uppertitle: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "400",
		fontSize: s(16),
		lineHeight: s(23),
		color: COLOR.RoyalBlue2,

		marginBottom: vs(10),
	},
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(24),
		lineHeight: s(53),
		color: COLOR.White,

		marginBottom: vs(6),
	},
	subtitle: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		lineHeight: s(18),
		color: COLOR.White,
		opacity: 0.5,
	},
})
