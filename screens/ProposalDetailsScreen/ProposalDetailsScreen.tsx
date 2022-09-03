import { useCallback, useMemo } from "react"
import { ListRenderItem, Share, StyleSheet, Text, View } from "react-native"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { observer } from "mobx-react-lite"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import moment from "moment"
import { openDeposit, openVoteRecap } from "modals/proposal"
import { COLOR, hexAlpha, round } from "utils"
import { RootStackParamList } from "types"
import { Button, ButtonBack, Icon2 } from "components/atoms"
import { Card, Diagram, Stat } from "./components/atoms"
import { CheckListItem, LegendItem } from "./components/moleculs"
import { useProposalStatusName } from "screens/ProposalScreen/hook"
import { rehydrateNewLines } from "utils/string"
import { fromAmountToCoin, getAssetTag } from "core/utils/Coin"
import { useStore } from "hooks"
import { SupportedCoins } from "constants/Coins"
import { Proposal, ProposalType } from "core/types/coin/cosmos/Proposal"
import { ProposalStatus } from "cosmjs-types/cosmos/gov/v1beta1/gov"
import { toJS } from "mobx"
import Config from "react-native-config"
import { formatNumber } from "utils/numbers"

type Props = NativeStackScreenProps<RootStackParamList, "ProposalDetails">

type ProposalEvent = {
	// ???? naming? Is it Event? ???
	completed: boolean
	title: string
	date: string
}

function openVoteRecapAction()
{
	return openVoteRecap({
		value: "yes",
		chain: "Bitsong",
	})
}

function openDepositAction()
{
	return openDeposit({})
}

const ActionButton: React.FC<{proposal: Proposal}> = ({proposal}) =>
{
	let action: () => any
	let text: string
	switch(proposal.status)
	{
		case ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD:
			text = "DEPOSIT"
			action = openDepositAction
			break
		case ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD:
			text = "VOTE"
			action = openVoteRecapAction
			break
		default:
			return null
	}
	return <Button
		text={text}
		textStyle={{
			fontSize: 14,
			lineHeight: 24,
		}}
		contentContainerStyle={{
			paddingHorizontal: 33,
			paddingVertical: 12,
		}}
		onPress={action}
		style={{ marginRight: 10 }}
	/>
}

export default observer<Props>(function ProposalDetailsScreen({ navigation, route }) {
	const { proposals } = useStore()
	const insets = useSafeAreaInsets()
	const { proposal } = route.params

	const goBack = useCallback(() => navigation.goBack(), [])

	const checklist: ProposalEvent[] = useMemo(
		() => proposals.steps(proposal),
		[proposal],
	)

	const resultsPercents = useMemo(() => proposals.percentages(proposal), [proposal])

	const renderCheckListItem = useCallback<ListRenderItem<ProposalEvent>>(
		({ item, index }) => (
			<CheckListItem {...item} style={checklist.length !== index + 1 && { marginRight: 13 }} />
		),
		[checklist.length],
	)

	const proposalStatus = useProposalStatusName(proposal.status)

	const shareProposal = useCallback(() =>
	{
		const url = Config.BITSONG_MINTSCAN + (Config.BITSONG_MINTSCAN[Config.BITSONG_MINTSCAN.length-1] == "/" ? "" : "/") + "proposals/" + proposal.id.toString()
		Share.share({
			message: url,
			url,
		})
	}, [proposal.id])

	return (
		<>
			<StatusBar style="light" />
			<View style={styles.container}>
				<ScrollView contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}>
					<View style={styles.wrapper}>
						<Text style={[styles.title, { marginBottom: 15, marginTop: 30 }]}>
							{proposal.title}
						</Text>

						<View style={[{ flexDirection: "row" }, { marginBottom: 20 }]}>
							<Button
								text={proposalStatus.toUpperCase()}
								contentContainerStyle={styles.buttonPassedContent}
							/>
						</View>

						<Text style={[styles.paragraph, { marginBottom: 14 }]}>
							{proposals.proposalTypeDescrition(proposal)}
						</Text>
						<View style={[{ flexDirection: "row" }, { marginBottom: 29 }]}>
							{proposal.chain &&
							<>
								<Text style={[styles.paragraph, { marginRight: 16 }]}>Minimum Deposit</Text>
								<Text style={styles.paragraph}>{proposals.minDeposit(proposal)} {getAssetTag(proposal.chain)}</Text>
							</>}
						</View>

						<View style={[{ flexDirection: "row" }, { marginBottom: 44 }]}>
							<ActionButton proposal={proposal}></ActionButton>
							<Button
								mode="gradient_border"
								contentContainerStyle={{
									paddingHorizontal: 20,
									paddingVertical: 16,
									backgroundColor: COLOR.Dark3,
								}}
								onPress={shareProposal}
							>
								<Icon2 name="link" style={{ width: 24, height: 12 }} stroke={COLOR.White} />
							</Button>
						</View>

						<Text style={[styles.caption, { marginBottom: 22 }]}>Results</Text>
						<View style={[{ flexDirection: "row" }, { marginBottom: 29 }]}>
							<Stat name="VOTE" persent={proposals.votedPercentage(proposal).toFixed(2)} style={{ marginRight: 19 }} />
							<Stat name="QUORUM" persent={proposals.quorum(proposal).toFixed(2)} />
						</View>

						{resultsPercents && (
							<Card style={[{ padding: 11 }, { marginBottom: 44 }]}>
								<Diagram {...resultsPercents} style={styles.diagram} />
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
						)}

						<Text style={[styles.caption, { marginBottom: 22 }]}>Checklist</Text>
					</View>

					<FlatList
						horizontal
						data={checklist}
						style={{ marginBottom: 44 }}
						contentContainerStyle={{ paddingHorizontal: 30 }}
						renderItem={renderCheckListItem}
					/>

					<View style={styles.wrapper}>
						<Text style={[styles.caption, { marginBottom: 22 }]}>Description</Text>
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
	wrapper: { marginHorizontal: 30 },
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 18,
		lineHeight: 24,
		color: COLOR.White,
	},
	buttonPassedContent: {
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	caption: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		color: COLOR.White,
	},
	paragraph: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 13,
		lineHeight: 16,
		color: COLOR.Grey1,
	},

	legendItem: { marginBottom: 5 },
	diagram: { marginVertical: 70 },
	descriptionCard: {
		paddingHorizontal: 26,
		paddingVertical: 33,
	},
	description: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		color: hexAlpha(COLOR.White, 50),
	},

	footer: {
		marginHorizontal: 30,
		position: "absolute",
		bottom: 0,
	},

	buttonContainer: { flexDirection: "row" },

	button: {
		backgroundColor: COLOR.White,
		borderRadius: 50,
		paddingHorizontal: 24,
		paddingVertical: 18,
		marginBottom: 16,
	},
	buttonText: {
		color: COLOR.Dark3,
	},
})
