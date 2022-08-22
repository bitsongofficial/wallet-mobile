import { useCallback, useMemo } from "react"
import { ListRenderItem, StyleSheet, Text, View } from "react-native"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { observer } from "mobx-react-lite"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import moment from "moment"
import { openVoteRecap } from "modals/proposal"
import { COLOR, hexAlpha, round } from "utils"
import { RootStackParamList } from "types"
import { Button, ButtonBack, Icon2 } from "components/atoms"
import { Card, Diagram, Stat } from "./components/atoms"
import { CheckListItem, LegendItem } from "./components/moleculs"
import { useProposalStatusName } from "screens/ProposalScreen/hook"

type Props = NativeStackScreenProps<RootStackParamList, "ProposalDetails">

type ProposalEvent = {
	// ???? naming? Is it Event? ???
	complited: boolean
	title: string
	date: string
}

export default observer<Props>(function ProposalDetailsScreen({ navigation, route }) {
	const insets = useSafeAreaInsets()
	const { proposal } = route.params

	const goBack = useCallback(() => navigation.goBack(), [])

	const openVoteModal = useCallback(() => {
		openVoteRecap({
			value: "yes",
			chain: "Bitsong",
		})
	}, [])

	const checklist: ProposalEvent[] = useMemo(
		() => [
			{
				complited: true,
				title: "Created",
				date: moment().subtract(1, "month").toString(),
			},
			{
				complited: false,
				title: "Deposit Period Ends",
				date: moment().subtract(1, "month").toString(),
			},
			{
				complited: false,
				title: "Deposit Period Ends",
				date: moment().subtract(1, "month").toString(),
			},
		],
		[],
	)

	const resultsPercents = useMemo(() => {
		if (proposal.result) {
			const { abstain, no, noWithZero, yes } = proposal.result
			const proportion = 100 / (abstain + no + noWithZero + yes)

			return {
				abstain: round(abstain * proportion),
				no: round(no * proportion),
				noWithZero: round(noWithZero * proportion),
				yes: round(yes * proportion),
			}
		}
	}, [
		proposal.result?.abstain,
		proposal.result?.no,
		proposal.result?.noWithZero,
		proposal.result?.yes,
	])

	const renderCheckListItem = useCallback<ListRenderItem<ProposalEvent>>(
		({ item, index }) => (
			<CheckListItem {...item} style={checklist.length !== index + 1 && { marginRight: 13 }} />
		),
		[checklist.length],
	)

	const proposalStatus = useProposalStatusName(proposal.status)

	return (
		<>
			<StatusBar style="light" />
			<View style={styles.container}>
				<ScrollView contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}>
					<View style={styles.wrapper}>
						<Text style={[styles.title, { marginBottom: 15, marginTop: 30 }]}>
							Increase minimum {"\n"}
							commission rate to 5%
						</Text>

						<View style={[{ flexDirection: "row" }, { marginBottom: 20 }]}>
							<Button
								text={proposalStatus.toUpperCase()}
								contentContainerStyle={styles.buttonPassedContent}
							/>
						</View>

						<Text style={[styles.paragraph, { marginBottom: 14 }]}>
							This is a text proposal. Text proposals can be proposed by anyone and are used as a
							signalling mechanism for this community. If this proposal is accepted, nothing will
							change without community coordination.
						</Text>
						<View style={[{ flexDirection: "row" }, { marginBottom: 29 }]}>
							<Text style={[styles.paragraph, { marginRight: 16 }]}>Minimum Deposit</Text>
							<Text style={styles.paragraph}>500 BTSG</Text>
						</View>

						<View style={[{ flexDirection: "row" }, { marginBottom: 44 }]}>
							<Button
								text="DEPOSIT"
								textStyle={{
									fontSize: 14,
									lineHeight: 24,
								}}
								contentContainerStyle={{
									paddingHorizontal: 33,
									paddingVertical: 12,
								}}
								onPress={openVoteModal}
								style={{ marginRight: 10 }}
							/>
							<Button
								mode="gradient_border"
								contentContainerStyle={{
									paddingHorizontal: 20,
									paddingVertical: 16,
									backgroundColor: COLOR.Dark3,
								}}
							>
								<Icon2 name="link" style={{ width: 24, height: 12 }} stroke={COLOR.White} />
							</Button>
						</View>

						<Text style={[styles.caption, { marginBottom: 22 }]}>Recent</Text>
						<View style={[{ flexDirection: "row" }, { marginBottom: 29 }]}>
							<Stat name="VOTE" persent={24} style={{ marginRight: 19 }} />
							<Stat name="QUORUM" persent={24} />
						</View>

						{resultsPercents && (
							<Card style={[{ padding: 11 }, { marginBottom: 44 }]}>
								<Diagram {...resultsPercents} style={styles.diagram} />
								<View>
									<LegendItem
										style={styles.legendItem}
										value={resultsPercents.yes}
										name="Yes"
										color={COLOR.White}
									/>
									<LegendItem
										style={styles.legendItem}
										value={resultsPercents.no}
										name="No"
										color={COLOR.RoyalBlue}
									/>
									<LegendItem
										style={styles.legendItem}
										value={resultsPercents.noWithZero}
										name="No With Veto"
										color={COLOR.SlateBlue}
									/>
									<LegendItem
										style={styles.legendItem}
										value={resultsPercents.abstain}
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
								Increase the minimum commission rate to 5%. This will help provide network stability
								and stop 0% validators driving commissions down. It also ensures Validators are
								earning enough to support secure and stable validation.
								{"\n"}
								{"\n"}
								If this proposal is accepted, it will imply having to update the blockchain so that
								it is possible to modify the commission of all validators automatically (see the
								Osmosis and/or Stargaze fork)
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
