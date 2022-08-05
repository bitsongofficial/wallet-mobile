import { StyleSheet, TextInputProps, View } from "react-native"
import { COLOR, hexAlpha } from "utils"
import { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { Icon2 } from "components/atoms"
import { TextInput } from "react-native-gesture-handler"

type SearchProps = TextInputProps & {
	loupe?: boolean
	bottomsheet?: boolean
	Right?: JSX.Element
	isFocus?: boolean
}

export default ({
	style,
	loupe = true,
	bottomsheet = true,
	Right,
	isFocus,
	...props
}: SearchProps) => {
	const Input = bottomsheet ? BottomSheetTextInput : TextInput

	return (
		<View style={[styles.container, isFocus && styles.container_focused, style]}>
			<Input
				style={styles.input}
				placeholderTextColor={COLOR.PaleCornflowerBlue}
				keyboardAppearance="dark"
				{...props}
			/>
			{loupe && (
				<View style={styles.iconContainer}>
					<Icon2 name="magnifying_glass" stroke={COLOR.PaleCornflowerBlue} size={21} />
				</View>
			)}
			{Right && <View style={styles.right}>{Right}</View>}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: hexAlpha(COLOR.Lavender, 10),
		borderRadius: 20,
		height: 62,
		flexDirection: "row",
		paddingLeft: 25,
		overflow: "hidden",
	},
	container_focused: {
		borderWidth: 2,
		borderColor: COLOR.Marengo,
	},
	input: {
		flex: 1,
		color: COLOR.White,
	},
	iconContainer: {
		paddingHorizontal: 25,
		alignItems: "center",
		justifyContent: "center",
	},
	right: {
		alignItems: "center",
		justifyContent: "center",
	},
})
