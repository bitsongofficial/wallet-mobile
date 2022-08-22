import { useCallback, useMemo, useState } from "react"
import { ListRenderItem, Platform, SafeAreaView, StyleSheet, View } from "react-native"
import { observer } from "mobx-react-lite"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import Animated from "react-native-reanimated"

import { COLOR } from "utils"
import { useStore } from "hooks"
import { RootStackParamList, RootTabParamList } from "types"
import { ProposalStatus } from "cosmjs-types/cosmos/gov/v1beta1/gov"
import { Proposal, ProposalType } from "core/types/coin/cosmos/Proposal"
import { SupportedCoins } from "constants/Coins"

import { CardCommission, Head, ITab, Tabs } from "./components/moleculs"
import { Shadow } from "./components/atoms"
import { useAnimateFlatlist } from "./hook"
import { openChangeChain } from "modals/proposal"
import { TouchableOpacity } from "react-native-gesture-handler"

type Props = CompositeScreenProps<
	NativeStackScreenProps<RootStackParamList>,
	BottomTabScreenProps<RootTabParamList, "Proposal">
>

export default observer<Props>(function Stacking({ navigation }) {
	// ------------ Tabs ----------------
	const [activeTab, setActiveTab] = useState<ITab>("All")
	const changeActiveTab = (tab: ITab) => setActiveTab(tab) // ????

	const status = useMemo(() => {
		switch (activeTab) {
			case "Deposit":
				return ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD
			case "Voting":
				return ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD
			case "Passed":
				return ProposalStatus.PROPOSAL_STATUS_PASSED
			case "Draft":
				return undefined
			case "Rejected":
				return ProposalStatus.PROPOSAL_STATUS_REJECTED
			default:
				return undefined
		}
	}, [activeTab])

	// -------------- Data -------------
	const { proposals } = useStore()
	// const filterdProposals = useMemo<Proposal[]>(() => mock, [status])
	const filterdProposals = useMemo(
		() => proposals.filterByCoinAndType(SupportedCoins.BITSONG, status).slice(),
		[status],
	)
	const renderProposals = useCallback<ListRenderItem<Proposal>>(
		({ item }) => (
			<TouchableOpacity
				style={styles.listItem}
				onPress={() => navigation.navigate("ProposalDetails", { proposal: item })}
			>
				<CardCommission key={item.id.toString()} title={item.title} status={item.status} />
			</TouchableOpacity>
		),
		[],
	)

	// ------------- Actions --------------
	const navToNew = useCallback(() => navigation.navigate("NewProposal"), [])
	const openChangeChainModal = useCallback(() => openChangeChain(), [])

	// -------------- Styles --------------
	const insets = useSafeAreaInsets()
	const flatlistContentStyle = useMemo(
		() => ({ paddingBottom: 100 + insets.bottom }),
		[insets.bottom],
	)

	// ----------- Animated Styles --------
	const [scrollHandler, animStyles] = useAnimateFlatlist()

	return (
		<>
			<StatusBar style="light" />
			<SafeAreaView style={styles.safearea} />
			<Animated.FlatList
				onScroll={scrollHandler}
				// ------------ Header -----------------
				stickyHeaderIndices={[0]}
				ListHeaderComponent={
					<View style={styles.listHeader}>
						<Head onPressChain={openChangeChainModal} onPressNew={navToNew} chain={"test"} />
						<Tabs active={activeTab} onPress={changeActiveTab} style={styles.tabs} />
						<Shadow style={animStyles.topShadow} />
					</View>
				}
				// ------------- List -------------------
				data={filterdProposals}
				renderItem={renderProposals}
				// ------------ Styles --------------------
				style={styles.flatlist}
				contentContainerStyle={flatlistContentStyle}
			/>
			<Shadow style={animStyles.bottomShadow} invert />
		</>
	)
})

const styles = StyleSheet.create({
	safearea: { backgroundColor: COLOR.Dark3 },
	flatlist: { backgroundColor: COLOR.Dark3 },
	listHeader: {
		backgroundColor: COLOR.Dark3,
		paddingTop: Platform.OS === "ios" ? 75 : 110,
	},
	tabs: { paddingHorizontal: 30 },
	listItem: {
		marginTop: 20,
		marginHorizontal: 30,
	},
})

const mock: Proposal[] = [
	{
		id: "1",
		chain: SupportedCoins.BITSONG,
		deposit: new Date(),
		description: "description",
		result: { yes: 23, abstain: 42, no: 87, noWithZero: 23 },
		status: ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD,
		submit: new Date(),
		title: "Increase minimum commission rate to 5%",
		type: ProposalType.PARAMETER_CHANGE,
		voting: { end: new Date(), start: new Date(), options: [] },
	},
	{
		id: "1",
		chain: SupportedCoins.BITSONG,
		deposit: new Date(),
		description: "description",
		result: { yes: 23, abstain: 42, no: 87, noWithZero: 23 },
		status: ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD,
		submit: new Date(),
		title: "Increase minimum commission rate to 5%",
		type: ProposalType.PARAMETER_CHANGE,
		voting: { end: new Date(), start: new Date(), options: [] },
	},
	{
		id: "1",
		chain: SupportedCoins.BITSONG,
		deposit: new Date(),
		description: "description",
		result: { yes: 23, abstain: 42, no: 87, noWithZero: 23 },
		status: ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD,
		submit: new Date(),
		title: "Increase minimum commission rate to 5%",
		type: ProposalType.PARAMETER_CHANGE,
		voting: { end: new Date(), start: new Date(), options: [] },
	},
	{
		id: "1",
		chain: SupportedCoins.BITSONG,
		deposit: new Date(),
		description: "description",
		result: { yes: 23, abstain: 42, no: 87, noWithZero: 23 },
		status: ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD,
		submit: new Date(),
		title: "Increase minimum commission rate to 5%",
		type: ProposalType.PARAMETER_CHANGE,
		voting: { end: new Date(), start: new Date(), options: [] },
	},
	{
		id: "1",
		chain: SupportedCoins.BITSONG,
		deposit: new Date(),
		description: "description",
		result: { yes: 23, abstain: 42, no: 87, noWithZero: 23 },
		status: ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD,
		submit: new Date(),
		title: "Increase minimum commission rate to 5%",
		type: ProposalType.PARAMETER_CHANGE,
		voting: { end: new Date(), start: new Date(), options: [] },
	},
]
