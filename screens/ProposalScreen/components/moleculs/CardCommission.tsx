import { memo } from "react"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { COLOR } from "utils"
import { Card, Icon2 } from "components/atoms"

type Props = {
	style?: StyleProp<ViewStyle>
}

export default memo(({ style }: Props) => (
	<Card style={[styles.card, style]}>
		<View>
			<Text style={styles.title}>
				Increase minimum{"\n"}
				commission rate{"\n"}
				to 5%
			</Text>
			<View style={styles.row}>
				<View style={styles.badge}>
					<Text style={styles.badgeText}>PASSED</Text>
				</View>
			</View>
		</View>

		<View style={styles.right}>
			<View style={{ alignItems: "flex-end" }}>
				<Text style={styles.percent}>24%</Text>
				<Text style={styles.voted}>VOTED</Text>
			</View>
			<View style={styles.arrowContainer}>
				<Icon2 name="arrow_right" stroke={COLOR.White} />
			</View>
		</View>
	</Card>
))

const styles = StyleSheet.create({
	card: {
		backgroundColor: COLOR.Dark2,
		paddingLeft: 22,
		paddingTop: 21,
		paddingRight: 18,
		paddingBottom: 17,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 18,
		color: COLOR.White,

		marginBottom: 20,
	},
	row: { flexDirection: "row" },
	badge: {
		paddingHorizontal: 16,
		paddingVertical: 5,
		borderRadius: 25,
		backgroundColor: COLOR.LightGreyBlue,
	},
	badgeText: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 9,
		color: COLOR.White,
	},

	right: {
		justifyContent: "space-between",
	},
	percent: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 18,
		color: COLOR.White,
	},
	voted: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 9,
		color: COLOR.BlueCrayola,
	},
	arrowContainer: {
		borderRadius: 25,
		backgroundColor: COLOR.Dark3,
		paddingHorizontal: 26,
		paddingVertical: 17,
	},
})
