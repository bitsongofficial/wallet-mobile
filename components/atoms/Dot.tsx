import { useSpring, animated } from "@react-spring/native"
import { StyleProp, StyleSheet, ViewStyle } from "react-native"
import { s } from "react-native-size-matters"
import { COLOR } from "utils"

type DotProps = {
	active: boolean
	style?: StyleProp<ViewStyle>
}

export default ({ active, style }: DotProps) => {
	const isActive = useSpring({
		width: active ? s(19) : s(8),
		backgroundColor: active ? COLOR.White : COLOR.Marengo,
	})

	return (
		<animated.View style={[styles.view, isActive, style]}>
			<></>
		</animated.View>
	)
}

const styles = StyleSheet.create({
	view: {
		height: s(8),
		borderRadius: s(30),
	},
})
