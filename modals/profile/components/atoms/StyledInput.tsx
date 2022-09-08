import { StyleSheet } from "react-native"
import { COLOR, hexAlpha } from "utils"
import { Input, InputProps } from "components/atoms"

type Props = InputProps & { isFocus?: boolean }

export default ({ style, bottomsheet = true, isFocus, ...props }: Props) => (
	<Input
		style={[styles.container, isFocus && styles.container_focused, style]}
		inputStyle={styles.input}
		placeholderTextColor={hexAlpha(COLOR.White, 50)}
		keyboardAppearance="dark"
		bottomsheet={bottomsheet}
		{...props}
	/>
)

const styles = StyleSheet.create({
	container: {
		backgroundColor: hexAlpha(COLOR.Lavender, 10),
		borderRadius: 20,
	},
	container_focused: {
		borderWidth: 2,
		borderColor: COLOR.Marengo,
	},
	input: {
		height: 62,
		color: COLOR.White,
	},
})
