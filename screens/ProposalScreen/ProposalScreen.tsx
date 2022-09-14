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
import { Proposal } from "core/types/coin/cosmos/Proposal"
import { SupportedCoins } from "constants/Coins"

import { CardCommission, Head, ITab, Tabs } from "./components/moleculs"
import { useAnimateFlatlist } from "hooks"
import { openChangeChain } from "modals/proposal"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Shadow } from "components/atoms"
import { HORIZONTAL_WRAPPER } from "utils/constants"
import { vs } from "react-native-size-matters"

type Props = CompositeScreenProps<
	NativeStackScreenProps<RootStackParamList>,
	BottomTabScreenProps<RootTabParamList, "Proposal">
>

export default observer<Props>(function Stacking({ navigation }) {
	// ------------ Tabs ----------------
	const [activeTab, setActiveTab] = useState<ITab>("All")
	const [activeChain, setActiveChain] = useState<SupportedCoins>(SupportedCoins.BITSONG)
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

	const changeActiveChain = useCallback((chain: SupportedCoins) => {
		proposals.addToRecent(chain)
		setActiveChain(chain)
	}, [])

	const filterdProposals = useMemo(
		() =>
			proposals
				.filterByCoinAndType(activeChain ? activeChain : SupportedCoins.BITSONG, status)
				.slice(),
		[status, activeChain],
	)
	const renderProposals = useCallback<ListRenderItem<Proposal>>(
		({ item }) => (
			<TouchableOpacity
				key={item.id.toString()}
				style={styles.listItem}
				onPress={() => navigation.navigate("ProposalDetails", { proposal: item })}
			>
				<CardCommission
					key={item.id.toString()}
					title={item.title}
					status={item.status}
					percentage={proposals.votedPercentage(item)}
				/>
			</TouchableOpacity>
		),
		[],
	)

	// ------------- Actions --------------
	const navToNew = useCallback(
		() =>
			navigation.navigate("NewProposal", {
				chain: activeChain,
			}),
		[],
	)
	const openChangeChainModal = useCallback(
		() =>
			openChangeChain({
				setActiveChain: changeActiveChain,
			}),
		[],
	)

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
				// data={[{ id: 1, title: "title", status: ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD }]}
				renderItem={renderProposals}
				// ------------ Styles --------------------
				style={styles.flatlist}
				contentContainerStyle={flatlistContentStyle}
				keyExtractor={(item) => item.id.toString()}
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
		paddingTop: vs(Platform.OS === "ios" ? 75 : 110),
	},
	tabs: { paddingHorizontal: HORIZONTAL_WRAPPER },
	listItem: {
		marginTop: 20,
		marginHorizontal: HORIZONTAL_WRAPPER,
	},
})
