import { StyleSheet, Text } from "react-native"
import { s, vs } from "react-native-size-matters"
import { observer } from "mobx-react-lite"
import { COLOR } from "utils"

type Props = {
	text: string
	onPress(): void
}

export default function InputActionText({ text, onPress }: Props) {
	return (
		<Text style={styles.subtitle} onPress={onPress}>
			{text}
		</Text>
	)
}

const styles = StyleSheet.create({
	subtitle: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		textAlign: "right",
		lineHeight: s(20),
		color: COLOR.RoyalBlue3,
		marginEnd: vs(20),
	},
})
