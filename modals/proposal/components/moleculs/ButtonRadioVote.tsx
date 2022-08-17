import { useCallback, useMemo } from "react"
import { View, Text, StyleProp, ViewStyle, StyleSheet } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { COLOR, hexAlpha } from "utils"
import { Icon2 } from "components/atoms"
import { useVoteIcon } from "../../hooks"
// TODO: need reorder components
import { RadioButton } from "screens/Profile/components/atoms"

export type VoteValue = "yes" | "no" | "no with veto" | "abstain"

type RadioProps = {
	value: VoteValue
	active: VoteValue
	onPress(value: VoteValue): void
	style?: StyleProp<ViewStyle>
}

export default ({ active, onPress, value, style }: RadioProps) => {
	const isActive = active === value

	const text = useMemo(() => {
		switch (value) {
			case "yes":
				return "Yes"
			case "no":
				return "No"
			case "no with veto":
				return "No with Veto"
			case "abstain":
				return "Abstain"
		}
	}, [value])

	const icon = useVoteIcon(value, isActive)

	const handlePress = useCallback(() => onPress(value), [value])

	return (
		<RectButton onPress={handlePress} style={[styles.container, style]}>
			<Icon2 size={24} name={icon} stroke={hexAlpha(COLOR.White, 20)} style={styles.icon} />
			<View style={styles.row}>
				<Text style={styles.text}>{text}</Text>
				<RadioButton isActive={isActive} />
			</View>
		</RectButton>
	)
}

const styles = StyleSheet.create({
	container: {
		height: 70,
		borderRadius: 20,
		flexDirection: "row",
		backgroundColor: COLOR.Dark3,
		paddingHorizontal: 24,
		alignItems: "center",
	},
	icon: { marginRight: 17 },
	row: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "space-between",
	},
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,
		color: COLOR.White,
	},
})
