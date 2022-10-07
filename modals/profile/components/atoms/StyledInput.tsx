import { StyleSheet } from "react-native"
import { COLOR, hexAlpha } from "utils"
import { Input, InputProps } from "components/atoms"
import { s } from "react-native-size-matters"

type Props = InputProps & { isFocus?: boolean }

export default ({ style, bottomsheet = true, isFocus, inputStyle, ...props }: Props) => (
	<Input
		style={[styles.container, isFocus && styles.container_focused, style]}
		inputStyle={[styles.input, inputStyle]}
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
	container_focused: {
		borderWidth: s(2),
		borderColor: COLOR.Marengo,
	},
	input: {
		height: s(62),
		color: COLOR.White,
	},
})
