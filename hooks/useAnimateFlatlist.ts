import {
	Extrapolation,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated"

export default function useAnimateFlatlist() {
	const translationY = useSharedValue(0)
	const translationYInvert = useSharedValue(80)

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: ({ contentOffset, contentSize, layoutMeasurement }) => {
			translationY.value = contentOffset.y
			translationYInvert.value = contentSize.height - (contentOffset.y + layoutMeasurement.height)
		},
	})

	const topShadow = useAnimatedStyle(() => {
		const value = interpolate(translationY.value, [0, 80], [0, 40], Extrapolation.CLAMP)
		return {
			bottom: -value,
			height: value,
		}
	})

	const bottomShadow = useAnimatedStyle(() => {
		const value = interpolate(translationYInvert.value, [0, 160], [0, 80], Extrapolation.CLAMP)
		return {
			height: value,
			bottom: 0,
		}
	})

	return [scrollHandler, { topShadow, bottomShadow }] as const
}
