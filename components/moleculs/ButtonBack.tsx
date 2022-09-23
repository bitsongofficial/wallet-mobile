import {
	StyleProp,
	StyleSheet,
	TextStyle,
	ViewStyle,
} from "react-native"
import Icon2 from "../atoms/Icon2"
import { COLOR } from "utils"
import { s } from "react-native-size-matters"
import { InlineButton } from "components/atoms"

type Props = {
	onPress?(): void
	style?: StyleProp<ViewStyle>
	text?: string
	stroke?: string
	textStyle?: StyleProp<TextStyle>
}

export default ({ onPress, style, text, textStyle, stroke }: Props) => {
	return (
		<InlineButton onPress={onPress} text={text || "Back"} Left={
			<Icon2 name="chevron_left" size={18} stroke={stroke || COLOR.White} />
		} style={style} textStyle={textStyle} />
	)
}

const styles = StyleSheet.create({
	container: {},
	inner: {
		flexDirection: "row",
		alignItems: "center",
	},
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		lineHeight: s(20),
		marginLeft: s(4),
	},
})
