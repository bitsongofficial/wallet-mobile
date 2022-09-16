import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated"
import { useTheme } from "hooks"
import { COLOR } from "utils"

type Props = {
	json: string
	style?: StyleProp<ViewStyle>
}

export default function CardData({ json, style }: Props) {
	const theme = useTheme()
	// https://stackoverflow.com/a/57839837

	const translationY = useSharedValue(0)
	const isScrolling = useSharedValue(false)
	const visibleHeight = useSharedValue(1)
	const wholeHeight = useSharedValue(1)

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: ({ contentOffset, contentSize, layoutMeasurement }) => {
			translationY.value = contentOffset.y
			visibleHeight.value = layoutMeasurement.height
			wholeHeight.value = contentSize.height
		},
		onBeginDrag: () => (isScrolling.value = true),
		onEndDrag: () => (isScrolling.value = false),
	})

	const animStyleY = useAnimatedStyle(() => {
		const size =
			wholeHeight.value > visibleHeight.value
				? Math.pow(visibleHeight.value, 2) / wholeHeight.value
				: visibleHeight.value

		const translateY = interpolate(
			translationY.value,
			[0, wholeHeight.value],
			[0, visibleHeight.value],
			Extrapolation.CLAMP,
		)

		return {
			height: size,
			transform: [{ translateY }],
		}
	})

	return (
		<View style={[styles.container, style]}>
			<Animated.ScrollView
				showsVerticalScrollIndicator={false}
				onScroll={scrollHandler}
				scrollEventThrottle={16}
			>
				<Text style={[styles.text, theme.text.primary]}>{json}</Text>
			</Animated.ScrollView>
			<Animated.View style={[styles.indicatorY, animStyleY]} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLOR.Dark3,
		paddingVertical: 22,
		paddingHorizontal: 26,
		borderRadius: 20,
		overflow: "hidden",
		flex: 1,
		flexDirection: "row",
	},
	indicatorY: {
		width: 5,
		borderRadius: 5,
		backgroundColor: COLOR.White,
		opacity: 0.2,
	},
	text: {
		fontFamily: "Courier Prime",
		fontStyle: "normal",
		fontWeight: "400",
		fontSize: 14,
		lineHeight: 16,
	},
})
