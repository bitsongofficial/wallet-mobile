import { useMemo } from "react"
import {
	StyleProp,
	StyleSheet,
	Text,
	TextInputProps,
	TextStyle,
	View,
	ViewStyle,
} from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { useTheme } from "hooks"
import { BottomSheetTextInput } from "@gorhom/bottom-sheet"

type Props = TextInputProps & {
	style?: StyleProp<ViewStyle>
	inputStyle?: StyleProp<TextStyle>
	autocomplite?: string | null
	bottomsheet?: boolean
	Right?: JSX.Element
}

const LINE_HEIGHT = 18

export default ({ inputStyle, style, autocomplite, bottomsheet, Right, ...props }: Props) => {
	const theme = useTheme()
	const Component = useMemo(() => (bottomsheet ? BottomSheetTextInput : TextInput), [bottomsheet])

	const autocomplitPosition = useMemo(
		() =>
			inputStyle?.height
				? {
						top: inputStyle?.height / 2 - LINE_HEIGHT / 2,
				  }
				: undefined,
		[inputStyle?.height],
	)

	return (
		<View style={[styles.container, theme.input.container, style]}>
			{autocomplite && (
				<Text style={[theme.input.autocomplite, styles.autocomplite, autocomplitPosition]}>
					{autocomplite}
				</Text>
			)}
			<View style={styles.row}>
				<Component
					style={[theme.input.component, styles.component, inputStyle]}
					placeholderTextColor={theme.input.placeholder}
					{...props}
				/>
				{Right}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 50,
		overflow: "hidden",
		backgroundColor: "green",
		width: "100%",
	},
	row: {
		flexDirection: "row",
		// flex: 1,
	},
	component: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "400",
		fontSize: 14,
		// https://stackoverflow.com/a/68458803
		paddingHorizontal: 24,
		paddingVertical: 19,
		height: LINE_HEIGHT,
		flex: 1,
	},
	autocomplite: {
		position: "absolute",
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "400",
		fontSize: 14,
		lineHeight: LINE_HEIGHT,
		top: 19,
		left: 25,
	},
})
