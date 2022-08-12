import { Icon2 } from "components/atoms"
import { StyleSheet, Text, View, ViewStyle } from "react-native"
import { COLOR, hexAlpha } from "utils"
import { Card } from "../atoms"
import moment from "moment"
import { StyleProp } from "react-native"

type Props = {
	title: string
	date: string
	complited: boolean
	style?: StyleProp<ViewStyle>
}

export default ({ complited, date, title, style }: Props) => (
	<Card style={[styles.container, style]}>
		<Icon2
			name={complited ? "check_fulfilled_gradient" : "check_fulfilled"}
			size={38}
			stroke={!complited && hexAlpha(COLOR.White, 20)}
			style={{ marginBottom: 14 }}
		/>
		<View style={styles.data}>
			<Text style={[styles.title, { color: complited ? COLOR.White : hexAlpha(COLOR.White, 20) }]}>
				{title}
			</Text>
			<Text
				style={[
					styles.dateFrom,
					{ color: complited ? COLOR.RoyalBlue : hexAlpha(COLOR.White, 20) },
				]}
			>
				{moment(date).fromNow()}
			</Text>
		</View>
	</Card>
)

const styles = StyleSheet.create({
	container: {
		width: 152,
		height: 167,
		alignItems: "center",
		paddingTop: 33,
		paddingBottom: 14,
		paddingHorizontal: 28,
	},
	data: {
		justifyContent: "space-between",
		alignItems: "center",
		flex: 1,
	},

	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 20,
		textAlign: "center",
	},

	dateFrom: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 12,
		lineHeight: 24,
	},
})
