import { useCallback, useMemo } from "react"
import { ListRenderItem, Share, StyleSheet, Text, View } from "react-native"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { observer } from "mobx-react-lite"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import moment from "moment"
import { openDeposit, openVote, openVoteRecap } from "modals/proposal"
import { COLOR, hexAlpha } from "utils"
import { RootStackParamList } from "types"
import { Button, ButtonBack, Icon2 } from "components/atoms"
import { Card, Diagram, Stat } from "./components/atoms"
import { CheckListItem, LegendItem } from "./components/moleculs"
import { useProposalStatusName } from "screens/ProposalScreen/hook"
import { rehydrateNewLines } from "utils/string"
import { getAssetTag } from "core/utils/Coin"
import { useStore } from "hooks"
import { SupportedCoins } from "constants/Coins"
import { Proposal } from "core/types/coin/cosmos/Proposal"
import { ProposalStatus } from "cosmjs-types/cosmos/gov/v1beta1/gov"
import Config from "react-native-config"
import { DepositController } from "modals/proposal/components/templates"
import { HORIZONTAL_WRAPPER } from "utils/constants"
import { s, vs } from "react-native-size-matters"

type Props = NativeStackScreenProps<RootStackParamList, "ProposalDetails">

type ProposalEvent = {
	// ???? naming? Is it Event? ???
	completed: boolean
	title: string
	date: string
}

const ActionButton: React.FC<{
	proposal: Proposal
	actionMap: { [k in ProposalStatus]?: () => any }
}> = ({ proposal, actionMap }) => {
	let text: string
	switch (proposal.status) {
		case ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD:
			text = "DEPOSIT"
			break
		case ProposalStatus.PROPOSAL_STATUS_REJECTED:
			text = "VOTE"
			break
		default:
			return null
	}
	return (
		<Button
			text={text}
			textStyle={{
				fontSize: s(14),
				lineHeight: s(24),
			}}
			contentContainerStyle={{
				paddingHorizontal: s(33),
				paddingVertical: s(12),
			}}
			onPress={actionMap[proposal.status] ?? (() => {})}
			style={{ marginRight: s(10) }}
		/>
	)
}

export default observer<Props>(function ProposalDetailsScreen({ navigation, route }) {
	const { proposals } = useStore()
	const insets = useSafeAreaInsets()
	const { proposal } = route.params

	const goBack = useCallback(() => navigation.goBack(), [])

	const checklist: ProposalEvent[] = useMemo(() => proposals.steps(proposal), [proposal])

	const actionMap = useMemo(
		() => ({
			[ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD]: () => {
				const controller = new DepositController()
				return openDeposit({
					proposal,
					controller,
					onDone: () => proposals.deposit(proposal, parseInt(controller.amountInput.value)),
				})
			},
			[ProposalStatus.PROPOSAL_STATUS_REJECTED]: () =>
				openVote({
					onVote: (value) =>
						openVoteRecap({
							value,
							chain: proposal.chain ?? SupportedCoins.BITSONG,
							onDone: () =>
								navigation.push("Loader", { callback: () => proposals.vote(proposal, value) }),
						}),
				}),
		}),
		[proposal],
	)

	const resultsPercents = useMemo(() => proposals.percentages(proposal), [proposal])

	const renderCheckListItem = useCallback<ListRenderItem<ProposalEvent>>(
		({ item, index }) => (
			<CheckListItem {...item} style={checklist.length !== index + 1 && styles.mr13} />
		),
		[checklist.length],
	)

	const proposalStatus = useProposalStatusName(proposal.status)

	const shareProposal = useCallback(() => {
		const url =
			Config.BITSONG_MINTSCAN +
			(Config.BITSONG_MINTSCAN[Config.BITSONG_MINTSCAN.length - 1] == "/" ? "" : "/") +
			"proposals/" +
			proposal.id.toString()
		Share.share({ message: url, url })
	}, [proposal.id])

	const isShowResults = useMemo(
		() =>
			proposal.status &&
			!(
				proposal.status in
				[
					ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD,
					ProposalStatus.UNRECOGNIZED,
					ProposalStatus.PROPOSAL_STATUS_UNSPECIFIED,
				]
			) &&
			resultsPercents,
		[proposal.status, resultsPercents],
	)

	return (
		<>
			<StatusBar style="light" />
			<View style={styles.container}>
				<ScrollView contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}>
					<View style={styles.wrapper}>
						<Text style={styles.title}>{proposal.title}</Text>

						<View style={[styles.row, styles.mb20]}>
							<Button
								text={proposalStatus.toUpperCase()}
								contentContainerStyle={styles.buttonPassedContent}
							/>
						</View>

						<Text style={[styles.paragraph, styles.mb14]}>
							{proposals.proposalTypeDescrition(proposal)}
						</Text>
						<View style={[styles.row, styles.mb29]}>
							{proposal.chain && (
								<>
									<Text style={[styles.paragraph, styles.mr16]}>Minimum Deposit</Text>
									<Text style={styles.paragraph}>
										{proposals.minDeposit(proposal)} {getAssetTag(proposal.chain)}
									</Text>
								</>
							)}
						</View>

						<View style={[styles.row, styles.mb44]}>
							<ActionButton proposal={proposal} actionMap={actionMap} />
							<Button
								mode="gradient_border"
								contentContainerStyle={styles.buttonShareProposal}
								onPress={shareProposal}
							>
								<Icon2 name="link" style={styles.iconLink} stroke={COLOR.White} />
							</Button>
						</View>
						{isShowResults && (
							<>
								<Text style={[styles.caption, styles.mb22]}>Results</Text>
								<View style={[styles.row, styles.mb29]}>
									<Stat
										name="VOTE"
										persent={proposals.votedPercentage(proposal).toFixed(2)}
										style={styles.statVote}
									/>
									<Stat name="QUORUM" persent={proposals.quorum(proposal).toFixed(2)} />
								</View>

								<Card style={[styles.cardDiagram, styles.mb44]}>
									{resultsPercents.total > 0 && (
										<Diagram {...resultsPercents} style={styles.diagram} />
									)}
									<View>
										<LegendItem
											style={styles.legendItem}
											value={resultsPercents.yes.toFixed(2)}
											name="Yes"
											color={COLOR.White}
										/>
										<LegendItem
											style={styles.legendItem}
											value={resultsPercents.no.toFixed(2)}
											name="No"
											color={COLOR.RoyalBlue}
										/>
										<LegendItem
											style={styles.legendItem}
											value={resultsPercents.noWithZero.toFixed(2)}
											name="No With Veto"
											color={COLOR.SlateBlue}
										/>
										<LegendItem
											style={styles.legendItem}
											value={resultsPercents.abstain.toFixed(2)}
											name="Abstain"
											color={COLOR.Dark3}
										/>
									</View>
								</Card>
							</>
						)}

						<Text style={[styles.caption, styles.mb22]}>Checklist</Text>
					</View>

					<FlatList
						horizontal
						data={checklist}
						style={styles.mb44}
						contentContainerStyle={styles.checkListContent}
						renderItem={renderCheckListItem}
					/>

					<View style={styles.wrapper}>
						<Text style={[styles.caption, styles.mb22]}>Description</Text>
						<Card style={styles.descriptionCard}>
							<Text style={styles.description}>
								{rehydrateNewLines(proposal.description ?? "")}
							</Text>
						</Card>
					</View>
				</ScrollView>
			</View>

			<View style={[styles.footer, { marginBottom: insets.bottom }]}>
				<View style={styles.buttonContainer}>
					<ButtonBack
						stroke={COLOR.Dark3}
						style={styles.button}
						textStyle={styles.buttonText}
						onPress={goBack}
					/>
				</View>
			</View>
		</>
	)
})

const styles = StyleSheet.create({
	container: { backgroundColor: COLOR.Dark3, flex: 1 },
	wrapper: { marginHorizontal: HORIZONTAL_WRAPPER },
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(18),
		lineHeight: s(24),
		color: COLOR.White,

		marginBottom: vs(15),
		marginTop: vs(30),
	},
	row: { flexDirection: "row" },
	mb20: { marginBottom: vs(20) },
	mb14: { marginBottom: vs(14) },
	mb29: { marginBottom: vs(29) },
	mb44: { marginBottom: vs(44) },
	mb22: { marginBottom: vs(22) },

	mr16: { marginRight: s(16) },
	mr13: { marginRight: 13 },

	statVote: { marginRight: s(19) },
	iconLink: {
		width: s(24),
		height: s(12),
	},
	buttonShareProposal: {
		paddingHorizontal: s(20),
		paddingVertical: s(16),
		backgroundColor: COLOR.Dark3,
	},

	cardDiagram: { padding: s(11) },

	checkListContent: { paddingHorizontal: HORIZONTAL_WRAPPER },
	buttonPassedContent: {
		paddingHorizontal: s(16),
		paddingVertical: s(8),
	},
	caption: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(16),
		color: COLOR.White,
	},
	paragraph: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(13),
		lineHeight: s(16),
		color: COLOR.Grey1,
	},

	legendItem: { marginBottom: s(5) },
	diagram: { marginVertical: s(70) },
	descriptionCard: {
		paddingHorizontal: s(26),
		paddingVertical: s(33),
	},
	description: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		lineHeight: s(18),
		color: hexAlpha(COLOR.White, 50),
	},

	footer: {
		marginHorizontal: HORIZONTAL_WRAPPER,
		position: "absolute",
		bottom: 0,
	},

	buttonContainer: { flexDirection: "row" },

	button: {
		backgroundColor: COLOR.White,
		borderRadius: s(50),
		paddingHorizontal: s(24),
		paddingVertical: s(18),
		marginBottom: s(16),
	},
	buttonText: {
		color: COLOR.Dark3,
	},
})
