import { StyleSheet } from "react-native"
import { COLOR, hexAlpha } from "utils"
import { Input, InputProps } from "components/atoms"
import { s } from "react-native-size-matters"

type Props = InputProps & { isFocus?: boolean, dark?: boolean }

export default ({ style, bottomsheet = true, isFocus, dark, inputStyle, ...props }: Props) => (
	<Input
		style={[styles.container, isFocus && styles.container_focused, style, dark && styles.containerDark, dark && isFocus && styles.container_focusedDark]}
		inputStyle={[styles.input, inputStyle, dark && styles.inputDark]}
		placeholderTextColor={hexAlpha(COLOR.White, 50)}
		keyboardAppearance="dark"
		bottomsheet={bottomsheet}
		{...props}
	/>
)

const styles = StyleSheet.create({
	container: {
		backgroundColor: hexAlpha(COLOR.Lavender, 10),
		borderRadius: s(20),
	},
	containerDark: {
		backgroundColor: COLOR.Dark3
	},
	container_focused: {
		borderWidth: s(2),
		borderColor: COLOR.Marengo,
	},
	container_focusedDark: {
		borderColor: COLOR.Dark3,
	},
	input: {
		height: s(62),
		color: COLOR.White,
	},
	inputDark: {
		color: COLOR.White
	}
})
