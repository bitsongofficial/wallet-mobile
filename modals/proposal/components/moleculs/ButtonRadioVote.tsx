import { useCallback, useMemo } from "react"
import { View, Text, StyleProp, ViewStyle, StyleSheet } from "react-native"
import { RectButton } from "react-native-gesture-handler"
import { COLOR, hexAlpha } from "utils"
import { Icon2 } from "components/atoms"
import { useVoteIcon } from "../../hooks"
// TODO: need reorder components
import { RadioButton } from "screens/Profile/components/atoms"
import { VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov"
import { s } from "react-native-size-matters"

type RadioProps = {
	value: VoteOption
	active: VoteOption
	onPress(value: VoteOption): void
	style?: StyleProp<ViewStyle>
}

export default ({ active, onPress, value, style }: RadioProps) => {
	const isActive = active === value

	const text = useMemo(() => {
		switch (value) {
			case VoteOption.VOTE_OPTION_YES:
				return "Yes"
			case VoteOption.VOTE_OPTION_NO:
				return "No"
			case VoteOption.VOTE_OPTION_NO_WITH_VETO:
				return "No with Veto"
			case VoteOption.VOTE_OPTION_ABSTAIN:
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
		height: s(70),
		borderRadius: s(20),
		flexDirection: "row",
		backgroundColor: COLOR.Dark3,
		paddingHorizontal: s(24),
		alignItems: "center",
	},
	icon: { marginRight: s(17) },
	row: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "space-between",
	},
	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		lineHeight: s(20),
		color: COLOR.White,
	},
})
