import { memo, useMemo } from "react"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { COLOR } from "utils"
import { Card, Icon2, ThemedGradient } from "components/atoms"
import { ProposalStatus } from "cosmjs-types/cosmos/gov/v1beta1/gov"
import { useProposalStatusName } from "screens/ProposalScreen/hook"

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
			<View style={{ flexShrink: 1, paddingEnd: 4 }}>
				<Text style={styles.title}>{title ?? "Unspecified"}</Text>
				<View style={[styles.row, { flexGrow: 1 }]}>
					<ThemedGradient style={styles.badge}>
						<Text style={styles.badgeText}>{statusLabel.toUpperCase()}</Text>
					</ThemedGradient>
				</View>
			</View>

			<View style={styles.right}>
				<View style={{ alignItems: "flex-end", marginBottom: 24 }}>
					<Text style={styles.percent}>{typeof percentage == "number" ? percentage.toFixed(2) : percentage}%</Text>
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
		paddingVertical: 7,
		borderRadius: 25,
		alignSelf: "flex-end",
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
		display: "flex",
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
		alignSelf: "flex-end",
	},
})
