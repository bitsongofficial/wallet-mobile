import { useCallback, useMemo, useState } from "react"
import {
	RefreshControl,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Platform,
	BackHandler,
	ScrollView,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { CoinStat, Tabs } from "components/organisms"
import { useGlobalBottomsheet, useStore } from "hooks"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { observer } from "mobx-react-lite"
import { ToolbarFull, ToolbarShort } from "./components"
import { RootStackParamList, RootTabParamList } from "types"
import { COLOR, wait } from "utils"
import { CompositeScreenProps } from "@react-navigation/native"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import ReceiveModal from "screens/SendModalScreens/ReceiveModal"
import { useSendModal } from "screens/SendModalScreens/components/hooks"
import { SupportedCoins } from "constants/Coins"
import { Button } from "components/atoms"
import { openClaim } from "modals/validator"

type ValueTabs = "Coins" | "Fan Tokens"

const tabs: ValueTabs[] = ["Coins"]

type Props = CompositeScreenProps<
	NativeStackScreenProps<RootStackParamList>,
	BottomTabScreenProps<RootTabParamList, "MainTab">
>

export default observer<Props>(function MainScreen({ navigation }) {
	const { coin, dapp, settings, validators } = useStore()
	// need culc by wallet

	const [activeTab, setActiveTab] = useState<ValueTabs>("Coins")

	const callback = useCallback(() => {}, [])

	// ------------- bottom sheet -----------
	const gbs = useGlobalBottomsheet()

	const safeAreaInsets = useSafeAreaInsets()
	const sendCoinContainerStyle = useMemo(
		() => ({ paddingBottom: safeAreaInsets.bottom }),
		[safeAreaInsets.bottom],
	)

	const openSendInner = useSendModal(sendCoinContainerStyle)
	const openSend = coin.CanSend ? openSendInner : undefined
	const closeGlobalBottomSheet = useCallback(() => gbs.close(), [])

	const openReceive = useCallback(async () => {
		const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			gbs.close()
			return true
		})
		await gbs.setProps({
			snapPoints: ["85%"],
			onClose: () => {
				backHandler.remove()
			},
			children: () => (
				<ReceiveModal style={sendCoinContainerStyle} close={closeGlobalBottomSheet} />
			),
		})
		requestAnimationFrame(() => gbs.expand())
	}, [])

	const openScannerMemorized = useCallback(() => (navigation.navigate("ScannerQR", {
		onBarCodeScanned: (uri: string) => {
			try {
				if (uri.startsWith("wc")) {
					dapp.connect(uri)
				}
			} catch (e) {
				console.error("Catched", e)
			}
		},
	})), [])

	const onPressClaim = () =>
	{
		navigation.push("Loader", {
			// @ts-ignore
			callback: async () => {
				await validators.claimAll()
			},
		})
	}

	const openScanner = coin.CanSend ? openScannerMemorized : undefined

	const openToolbar = useCallback(async () => {
		const onPressScann = () => {
			openScanner && openScanner()
			Platform.OS === "android" && gbs.close()
		}

		await gbs.setProps({
			snapPoints: ["70%"],
			children: () => (
				<ToolbarFull
					style={styles.toolbar_full}
					onPressSend={openSend}
					onPressReceive={openReceive}
					onPressInquire={undefined}
					onPressScan={onPressScann}
					onPressClaim={onPressClaim}
					onPressStake={undefined}
					onPressUnstake={undefined}
					onPressRestake={undefined}
					onPressIssue={undefined}
					onPressMint={undefined}
					onPressBurn={undefined}
				/>
			),
		})
		requestAnimationFrame(() => gbs.expand())
	}, [coin.CanSend])

	const openClaimAll = useCallback(() => {
		openClaim({
			amount: validators.totalReward,
			coinName: "BTSG",
			onDone: () => (validators.claimAll()),
			navigation,
		})
	}, [validators.totalReward])

	const [isRefreshing, setRefreshing] = useState(false)

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		await coin.updateBalances()
		setRefreshing(false)
	}, [])

	return (
		<>
			<StatusBar style="light" />

			<SafeAreaView style={styles.container}>
				<ScrollView
					style={styles.scrollviewContent}
					refreshControl={
						<RefreshControl
							tintColor={COLOR.White}
							refreshing={isRefreshing}
							onRefresh={onRefresh}
						/>
					}
				>
					<View style={styles.info}>
						<View style={styles.balance}>
							<Text style={styles.balance_title}>Total Balance</Text>
							<Text style={styles.balance_value}>{coin.totalBalance.toLocaleString("en")} {settings.currency?.symbol}</Text>
							{/* <Text style={styles.balance_variation}>Variation {variation} %</Text> */}
						</View>

						<View style={styles.reward}>
							<Text style={styles.reward_title}>Reward</Text>
							<View style={styles.reward_row}>
								<Text style={styles.reward_value}>{validators.totalRewardAsDollars.toFixed(2)} $</Text>
								<Button onPress={openClaimAll}>CLAIM</Button>
							</View>
						</View>
					</View>
					<ToolbarShort
						style={styles.toolbar_short}
						onPressAll={openToolbar}
						onPressInquire={undefined}
						onPressReceive={openReceive}
						onPressScan={openScanner}
						onPressSend={openSend}
					/>
					<Tabs
						values={tabs}
						active={activeTab}
						// @ts-ignore TODO: create cool types
						onPress={setActiveTab}
						style={styles.tabs}
					/>

					<View style={styles.coins}>
						{coin.coins
							.filter((c) => c.balance > 0 || c.info.coin == SupportedCoins.BITSONG)
							.map((coin) => (
								<TouchableOpacity key={coin.info._id} disabled={true}>
									<CoinStat coin={coin} style={{ marginBottom: 9 }} />
								</TouchableOpacity>
							))}
					</View>
				</ScrollView>
			</SafeAreaView>
		</>
	)
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexShrink: 1,
		backgroundColor: COLOR.Dark3,
	},

	scrollviewContent: {
		marginTop: 40,
		paddingTop: 40,
		flex:1,
		flexShrink: 1,
	},
	info: {
		marginRight: 22,
		marginLeft: 32,
		marginBottom: 60,
	},
	balance: {
		marginBottom: 34,
	},
	balance_title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "400",
		fontSize: 18,
		lineHeight: 23,
		color: COLOR.RoyalBlue2,

		marginBottom: 10,
	},
	balance_value: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 42,
		lineHeight: 53,
		color: COLOR.White,

		marginBottom: 6,
	},
	balance_variation: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 14,
		lineHeight: 18,
		color: COLOR.White,
		opacity: 0.5,
	},

	reward: {},
	reward_title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "400",
		fontSize: 16,
		lineHeight: 20,
		color: COLOR.RoyalBlue2,
		marginBottom: 10,
	},
	reward_value: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 30,
		color: COLOR.White,
	},

	reward_row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},

	toolbar_short: {
		marginHorizontal: 24,
		marginBottom: 40,
	},
	toolbar_full: {
		padding: 24,
		...StyleSheet.absoluteFillObject,
		zIndex: 10,
	},

	tabs: {
		paddingHorizontal: 30,
		marginBottom: 18,
	},
	coins: {
		flex: 1,
		paddingTop: 8,
		paddingBottom: 64,
		marginHorizontal: 14,
	},
})
