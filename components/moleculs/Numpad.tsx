import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useTheme } from "hooks"
import { mvs, s, vs } from "react-native-size-matters"

const defaultNumpad = [
	["1", "2", "3"],
	["4", "5", "6"],
	["7", "8", "9"],
	[".", "0", "C"],
]

type Props = {
	onPress(num: string): void
	onPressRemove(): void
	style?: StyleProp<ViewStyle>
	numpad?: (string | undefined)[][]
	keyStyle?: StyleProp<ViewStyle>
}

export default function Numpad({
	onPress,
	style,
	onPressRemove,
	numpad = defaultNumpad,
	keyStyle,
}: Props) {
	const theme = useTheme()

	const handleTouch = (num?: string) => num && (num === "C" ? onPressRemove() : onPress(num))

	return (
		<View style={style}>
			{numpad.map((row, index) => (
				<View key={index} style={styles.row}>
					{row.map((num, index) => (
						<TouchableOpacity
							key={num?.toString() || "key" + index}
							onPress={() => handleTouch(num)}
						>
							<View style={[styles.num, keyStyle]}>
								<Text style={[styles.text, theme.text.primary]}>{num}</Text>
							</View>
						</TouchableOpacity>
					))}
				</View>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	num: {
		width: mvs(50, 1.1),
		height: mvs(50, 1.1),
		alignItems: "center",
		justifyContent: "center",
		borderRadius: mvs(50, 1.1),
	},
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: mvs(20, 1.1),
		lineHeight: mvs(27),
	},
})
