import { memo } from "react"
import { StyleProp, StyleSheet, ViewStyle } from "react-native"
import Animated, { AnimatedStyleProp } from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { COLOR } from "utils"

type Props = {
	style?: AnimatedStyleProp<StyleProp<ViewStyle>>
	invert?: boolean
}

export default memo(({ style, invert }: Props) => {
	const colors = !invert ? [COLOR.Dark3, COLOR.Transparent] : [COLOR.Transparent, COLOR.Dark3]
	return (
		<Animated.View style={[styles.container, style]}>
			<LinearGradient colors={colors} style={styles.gradient} />
		</Animated.View>
	)
})

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		width: "100%",
	},
	gradient: { flex: 1 },
})
