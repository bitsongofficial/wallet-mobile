import { memo } from "react"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { COLOR } from "utils"
import { Card, Icon2 } from "components/atoms"
import { ProposalStatus } from "cosmjs-types/cosmos/gov/v1beta1/gov"

type Props = {
	title?: string,
	status?: ProposalStatus
	style?: StyleProp<ViewStyle>
}

export default memo(({ style, title, status }: Props) =>
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
			<View>
				<Text style={styles.title}>
					{title ?? "Unspecified"}
				</Text>
				<View style={styles.row}>
					<View style={styles.badge}>
						<Text style={styles.badgeText}>
							{statusLabel}
						</Text>
					</View>
				</View>
			</View>
	
			<View style={styles.right}>
				{/* <View style={{ alignItems: "flex-end" }}>
					<Text style={styles.percent}>24%</Text>
					<Text style={styles.voted}>VOTED</Text>
				</View>
				<View style={styles.arrowContainer}>
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
