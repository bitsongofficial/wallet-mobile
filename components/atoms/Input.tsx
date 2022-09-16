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
import { s } from "react-native-size-matters"

export type Props = TextInputProps & {
	style?: StyleProp<ViewStyle>
	inputStyle?: StyleProp<TextStyle>
	autocomplite?: string | null
	bottomsheet?: boolean
	Right?: JSX.Element

	errorMessage?: string | string[] | false
	errorStyle?: StyleProp<ViewStyle>
}

const LINE_HEIGHT = s(18)
const BORDER_RADIUS = s(50)

export default ({
	inputStyle,
	style,
	autocomplite,
	bottomsheet,
	Right,
	errorMessage,
	errorStyle,
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

	const errorText = useMemo(
		() => (Array.isArray(errorMessage) ? errorMessage[0] : errorMessage),
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

			{errorText && <ErrorMessage message={errorText} style={errorStyle} />}
		</View>
	)
}

type ErrorProps = {
	message: string
	style?: StyleProp<ViewStyle>
}

const ErrorMessage = ({ message, style }: ErrorProps) => (
	<Text style={[styles.error, style]}>{message}</Text>
)

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
		fontSize: s(14),
		// https://stackoverflow.com/a/68458803
		paddingHorizontal: s(24),
		paddingVertical: s(19),
		height: LINE_HEIGHT,
		flex: 1,
	},
	autocomplite: {
		position: "absolute",
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "400",
		fontSize: s(14),
		lineHeight: LINE_HEIGHT,
		top: s(19),
		left: s(25),
	},

	error: {
		position: "absolute",
		bottom: s(-19),
		left: s(24),

		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(12),
		lineHeight: s(15),

		color: COLOR.Pink2,
	},
})
