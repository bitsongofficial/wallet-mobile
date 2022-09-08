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
import { COLOR } from "utils"

export type Props = TextInputProps & {
	style?: StyleProp<ViewStyle>
	inputStyle?: StyleProp<TextStyle>
	autocomplite?: string | null
	bottomsheet?: boolean
	Right?: JSX.Element

	errorMessage?: string | false
}

const LINE_HEIGHT = 18
const BORDER_RADIUS = 50

export default ({
	inputStyle,
	style,
	autocomplite,
	bottomsheet,
	Right,
	errorMessage,
	...props
}: Props) => {
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

	const errorBorder = useMemo<false | ViewStyle>(
		() =>
			!!errorMessage && {
				borderWidth: 1,
				borderColor: COLOR.Pink3,
			},
		[errorMessage],
	)

	return (
		<View style={[styles.container, theme.input.container, style, errorBorder]}>
			{autocomplite && (
				<Text style={[theme.input.autocomplite, styles.autocomplite, autocomplitPosition]}>
					{autocomplite}
				</Text>
			)}

			<View style={styles.row}>
				<Component
					style={[theme.input.component, styles.input, inputStyle]}
					placeholderTextColor={theme.input.placeholder}
					{...props}
				/>
				{Right}
			</View>

			{errorMessage && <ErrorMessage message={errorMessage} />}
		</View>
	)
}

type ErrorMessageProps = {
	message: string
}

const ErrorMessage = ({ message }: ErrorMessageProps) => <Text style={styles.error}>{message}</Text>

const styles = StyleSheet.create({
	container: {
		borderRadius: BORDER_RADIUS,
		width: "100%",
	},
	row: {
		flexDirection: "row",
		overflow: "hidden",
	},
	input: {
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

	error: {
		position: "absolute",
		bottom: -19,
		left: 24,

		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 12,
		lineHeight: 15,

		color: COLOR.Pink2,
	},
})
