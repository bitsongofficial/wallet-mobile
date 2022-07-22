import { memo } from "react"
import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native"
import { RectButton, ScrollView } from "react-native-gesture-handler"
import { COLOR } from "utils"

export type ITab = "All" | "Deposit" | "Voting" | "Passed"

const tabs: ITab[] = ["All", "Deposit", "Voting", "Passed"]

type Props = {
	style: StyleProp<ViewStyle>
	active: ITab
	onPress(value: ITab): void
}

export default memo(({ style, active, onPress }: Props) => (
	<ScrollView horizontal contentContainerStyle={[styles.content, style]}>
		{tabs.map((tab) => (
			<RectButton onPress={() => onPress(tab)} style={[styles.tab, tab !== "Passed" && styles.gap]}>
				<Text style={[styles.text, active === tab && styles.active]}>{tab}</Text>
			</RectButton>
		))}
	</ScrollView>
))

const styles = StyleSheet.create({
	content: { paddingVertical: 10 },
	tab: {
		paddingHorizontal: 12,
		paddingVertical: 5,
	},
	gap: {
		marginRight: 30,
	},

	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		color: COLOR.Marengo,
	},
	active: {
		color: COLOR.White,
	},
})
