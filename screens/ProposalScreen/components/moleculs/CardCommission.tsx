import { memo } from "react"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { COLOR } from "utils"
import { Card, Icon2, ThemedGradient } from "components/atoms"
import { ProposalStatus } from "cosmjs-types/cosmos/gov/v1beta1/gov"
import { useProposalStatusName } from "screens/ProposalScreen/hook"
import { s } from "react-native-size-matters"

type Props = {
	title?: string
	percentage?: string | number
	status?: ProposalStatus
	style?: StyleProp<ViewStyle>
}

export default memo(({ style, title, status, percentage }: Props) => {
	const statusLabel = useProposalStatusName(status)

	return (
		<Card style={[styles.card, style]}>
			<View style={{ flexShrink: 1, paddingEnd: s(4) }}>
				<Text style={styles.title}>{title ?? "Unspecified"}</Text>
				<View style={[styles.row, { flexGrow: 1 }]}>
					<ThemedGradient style={styles.badge}>
						<Text style={styles.badgeText}>{statusLabel.toUpperCase()}</Text>
					</ThemedGradient>
				</View>
			</View>

			<View style={styles.right}>
				<View style={{ alignItems: "flex-end", marginBottom: s(24) }}>
					<Text style={styles.percent}>
						{typeof percentage == "number" ? percentage.toFixed(2) : percentage}%
					</Text>
					<Text style={styles.voted}>VOTED</Text>
				</View>
				<View style={styles.arrowContainer}>
					<Icon2 name="arrow_right" stroke={COLOR.White} />
				</View>
			</View>
		</Card>
	)
})

const styles = StyleSheet.create({
	card: {
		backgroundColor: COLOR.Dark2,
		paddingLeft: s(22),
		paddingTop: s(21),
		paddingRight: s(18),
		paddingBottom: s(17),
		flexDirection: "row",
		justifyContent: "space-between",
	},
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(18),
		color: COLOR.White,

		marginBottom: s(20),
	},
	row: { flexDirection: "row" },
	badge: {
		paddingHorizontal: s(16),
		paddingVertical: s(7),
		borderRadius: s(25),
		alignSelf: "flex-end",
	},
	badgeText: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(9),
		color: COLOR.White,
	},

	right: {
		justifyContent: "space-between",
		display: "flex",
	},
	percent: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(18),
		color: COLOR.White,
	},
	voted: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(9),
		color: COLOR.BlueCrayola,
	},
	arrowContainer: {
		borderRadius: s(25),
		backgroundColor: COLOR.Dark3,
		paddingHorizontal: s(26),
		paddingVertical: s(17),
		alignSelf: "flex-end",
	},
})
