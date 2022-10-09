import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Icon2 } from "components/atoms"
import { COLOR, hexAlpha } from "utils"
import { s } from "react-native-size-matters"

type Props = {
	onPressClose(): void
	style?: StyleProp<ViewStyle>
}

export default ({ onPressClose, style }: Props) => {

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
