import {
	ListRenderItem,
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewProps,
	ViewStyle,
} from "react-native"
import { observer } from "mobx-react-lite"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { COLOR, hexAlpha } from "utils"
import { RootStackParamList } from "types"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Button, Icon2 } from "components/atoms"
import { useMemo } from "react"
import { Card, Diagram, Stat } from "./components/atoms"
import { CheckListItem, LegendItem } from "./components/moleculs"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import moment from "moment"
import { useCallback } from "react"

type Props = NativeStackScreenProps<RootStackParamList, "ProposalDetails">

type ProposalEvent = {
	// ???? naming ???
	complited: boolean
	title: string
	date: string
}

export default observer<Props>(function ProposalDetailsScreen({ navigation }) {
	const { top } = useSafeAreaInsets()

	const results = useMemo(
		() => ({
			yes: 54.65,
			no: 17.34,
			noWithVeto: 16.02,
			abstain: 8.98,
		}),
		[],
	)

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
		],
		[],
	)

	const renderCheckListItem = useCallback<ListRenderItem<ProposalEvent>>(
		({ item }) => <CheckListItem {...item} style={{ marginRight: 13 }} />,
		[],
	)

	return (
		<>
			<StatusBar style="light" />
			<View style={styles.container}>
				<ScrollView>
					<View style={styles.wrapper}>
						<Text style={[styles.title, { marginBottom: 15, marginTop: 30 }]}>
							Increase minimum {"\n"}
							commission rate to 5%
						</Text>
						<View style={[{ flexDirection: "row" }, { marginBottom: 20 }]}>
							<Button text="PASSED" contentContainerStyle={styles.buttonPassedContent} />
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

						<Card style={[{ padding: 11 }, { marginBottom: 44 }]}>
							<Diagram {...results} style={styles.diagram} />
							<View>
								<LegendItem
									style={styles.legendItem}
									value={results.yes}
									name="Yes"
									color={COLOR.White}
								/>
								<LegendItem
									style={styles.legendItem}
									value={results.no}
									name="No"
									color={COLOR.RoyalBlue}
								/>
								<LegendItem
									style={styles.legendItem}
									value={results.noWithVeto}
									name="No With Veto"
									color={COLOR.SlateBlue}
								/>
								<LegendItem
									style={styles.legendItem}
									value={results.abstain}
									name="Abstain"
									color={COLOR.Dark3}
								/>
							</View>
						</Card>
						<Text style={[styles.caption, { marginBottom: 22 }]}>Checklist</Text>
					</View>

					<FlatList
						horizontal
						data={checklist}
						style={{ marginBottom: 44 }}
						contentContainerStyle={styles.wrapper}
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
})
