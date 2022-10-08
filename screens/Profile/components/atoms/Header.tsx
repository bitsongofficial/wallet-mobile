import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Icon2 } from "components/atoms"
import { COLOR, hexAlpha } from "utils"
import Animated, {
	Extrapolation,
	interpolate,
	SharedValue,
	useAnimatedStyle,
} from "react-native-reanimated"
import { s } from "react-native-size-matters"

type Props = {
	onPressClose(): void
	style?: StyleProp<ViewStyle>
	animtedValue: SharedValue<number>
}

export default ({ onPressClose, style, animtedValue }: Props) => {
	const logoStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					scale: interpolate(animtedValue.value, [0, 32], [1, 0], Extrapolation.CLAMP),
				},
			],
		}
	})

	return (
		<View style={[styles.container, style]} pointerEvents={"box-none"}>
			<TouchableOpacity style={styles.button} onPress={onPressClose}>
				<Icon2 name="close" size={18} stroke={COLOR.White} />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		height: s(55),
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
	},
	button: {
		backgroundColor: hexAlpha(COLOR.White, 10),
		padding: s(13),
		borderRadius: s(35),
	},
})
