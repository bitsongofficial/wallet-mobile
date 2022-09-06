import { useCallback } from "react"
import {
	GestureResponderEvent,
	StyleProp,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
	ViewStyle,
} from "react-native"
import { COLOR, hexAlpha } from "utils"

type Props = {
	text?: string
	index?: number
	style?: StyleProp<ViewStyle>
	hidden?: boolean

	onPress?(text: string): void
	isActive?: boolean
}

export default ({ index, text, style, hidden, onPress, isActive }: Props) => {
	const handlePress = useCallback(
		(e: GestureResponderEvent) => {
			e.preventDefault()
			text && onPress && onPress(text)
		},
		[text, onPress],
	)
	return (
		<TouchableWithoutFeedback onPress={handlePress}>
			<View
				style={[
					styles.container,
					hidden && styles.containerHidden,
					isActive && styles.containerHidden,
					style,
				]}
			>
				<Text style={[styles.index, hidden && styles.hidden]}>{index}.</Text>
				<Text style={[styles.text, hidden && styles.hidden]}>{text}</Text>
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLOR.Dark3,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20, // 22 -
		paddingVertical: 11,
		borderRadius: 50,
		borderWidth: 2,
		borderColor: COLOR.Dark2,
	},
	containerHidden: {
		backgroundColor: COLOR.Dark2,
	},
	hidden: {
		color: "transparent",
	},
	index: {
		fontFamily: "CircularStd",
		color: hexAlpha(COLOR.White, 40),
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 18,
		lineHeight: 23,
		marginRight: 6,
	},
	text: {
		fontFamily: "CircularStd",
		color: COLOR.White,
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,
	},
})
