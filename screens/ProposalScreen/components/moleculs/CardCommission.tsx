import { memo } from "react"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { COLOR } from "utils"
import { Card, Icon2 } from "components/atoms"
import { ProposalStatus } from "cosmjs-types/cosmos/gov/v1beta1/gov"
import { useStore } from "hooks"

type Props = {
	title?: string,
	percentage?: string | number,
	status?: ProposalStatus
	style?: StyleProp<ViewStyle>
}

export default memo(({ style, title, status, percentage }: Props) =>
{
	let statusLabel = "N/A"
	switch(status)
	{
		case ProposalStatus.PROPOSAL_STATUS_PASSED:
			statusLabel = "passed"
			break

		case ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD:
			statusLabel = "deposit"
			break

		case ProposalStatus.PROPOSAL_STATUS_FAILED:
			statusLabel = "failed"
			break

		case ProposalStatus.PROPOSAL_STATUS_REJECTED:
			statusLabel = "rejected"
			break

		case ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD:
			statusLabel = "voting"
			break
	}
	return (
		<Card style={[styles.card, style]}>
			<View style={{flexShrink: 1, paddingEnd: 4}}>
				<Text style={styles.title}>
					{title ?? "Unspecified"}
				</Text>
				<View style={[styles.row, {flexGrow: 1}]}>
					<View style={styles.badge}>
						<Text style={styles.badgeText}>
							{statusLabel.toUpperCase()}
						</Text>
					</View>
				</View>
			</View>
	
			<View style={styles.right}>
				<View style={{ alignItems: "flex-end", marginBottom: 14 }}>
					<Text style={styles.percent}>{percentage}%</Text>
					<Text style={styles.voted}>VOTED</Text>
				</View>
				{/* <View style={styles.arrowContainer}>
					<Icon2 name="arrow_right" stroke={COLOR.White} />
				</View> */}
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
		paddingVertical: 10,
		borderRadius: 25,
		backgroundColor: COLOR.LightGreyBlue,
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
