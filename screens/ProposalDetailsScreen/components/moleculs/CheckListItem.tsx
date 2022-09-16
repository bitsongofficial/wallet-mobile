import { memo } from "react"
import { StyleSheet, Text, View, ViewStyle, StyleProp } from "react-native"
import { s } from "react-native-size-matters"
import { COLOR, hexAlpha } from "utils"
import { Icon2 } from "components/atoms"
import { Card } from "../atoms"
import moment from "moment"

type Props = {
	title: string
	date: string
	completed: boolean
	style?: StyleProp<ViewStyle>
}

export default memo(({ completed, date, title, style }: Props) => (
	<Card style={[styles.container, style]}>
		<Icon2
			name={completed ? "check_fulfilled_gradient" : "check_fulfilled"}
			size={38}
			stroke={!completed && hexAlpha(COLOR.White, 20)}
			style={styles.iconCheck}
		/>
		<View style={styles.data}>
			<Text style={[styles.title, { color: completed ? COLOR.White : hexAlpha(COLOR.White, 20) }]}>
				{title}
			</Text>
			<Text
				style={[
					styles.dateFrom,
					{ color: completed ? COLOR.RoyalBlue : hexAlpha(COLOR.White, 20) },
				]}
			>
				{moment(date).fromNow()}
			</Text>
		</View>
	</Card>
))

const styles = StyleSheet.create({
	container: {
		width: s(152),
		height: s(167),
		alignItems: "center",
		paddingTop: s(33),
		paddingBottom: s(14),
		paddingHorizontal: s(28),
	},
	data: {
		justifyContent: "space-between",
		alignItems: "center",
		flex: 1,
	},
	iconCheck: { marginBottom: s(14) },

	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		lineHeight: s(20),
		textAlign: "center",
	},

	dateFrom: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(12),
		lineHeight: s(24),
	},
})
