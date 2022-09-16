import { memo } from "react"
import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native"
import { RectButton, ScrollView } from "react-native-gesture-handler"
import { s } from "react-native-size-matters"
import { COLOR } from "utils"

export type ITab = "All" | "Deposit" | "Voting" | "Passed" | "Rejected" | "Draft"
const tabs: ITab[] = ["All", "Deposit", "Voting", "Passed", "Rejected", "Draft"]

type Props = {
	style: StyleProp<ViewStyle>
	active: ITab
	onPress(value: ITab): void
}

export default memo(({ style, active, onPress }: Props) => (
	<ScrollView horizontal contentContainerStyle={style}>
		{tabs.map((tab, index) => (
			<RectButton
				onPress={() => onPress(tab)}
				style={[styles.tab, index !== tabs.length - 1 && styles.gap]}
			>
				<Text style={[styles.text, active === tab && styles.active]}>{tab}</Text>
			</RectButton>
		))}
	</ScrollView>
))

const styles = StyleSheet.create({
	tab: {
		paddingHorizontal: s(12),
		height: s(48),
		justifyContent: "center",
	},
	gap: {
		marginRight: s(30),
	},

	text: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		color: COLOR.Marengo,
	},
	active: {
		color: COLOR.White,
	},
})
