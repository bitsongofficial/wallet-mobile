import { useCallback, useMemo, useState } from "react"
import {
	RefreshControl,
	StyleSheet,
	TouchableOpacity,
	View,
	Platform,
} from "react-native"
import { CoinStat, Tabs } from "components/organisms"
import { useGlobalBottomsheet, useStore } from "hooks"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { observer } from "mobx-react-lite"
import { ToolbarFull, ToolbarShort } from "./components"
import { RootStackParamList, RootTabParamList } from "types"
import { COLOR } from "utils"
import { CompositeScreenProps } from "@react-navigation/native"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { ReceiveModal } from "modals/wallets/modals"
import { SupportedCoins } from "constants/Coins"
import { Button, Title } from "components/atoms"
import { openClaim } from "modals/validator"
import { formatNumber } from "utils/numbers"
import { openSend, openSendIbc } from "modals/wallets"
import { s, vs } from "react-native-size-matters"
import { withStatusBar } from "screens/layout/hocs"
import BottomNavigator from "screens/layout/BottomNavigator"
import { useTranslation } from "react-i18next"

type ValueTabs = "Coins" | "Fan Tokens"

const tabs: ValueTabs[] = ["Coins"]

type Props = CompositeScreenProps<
	NativeStackScreenProps<RootStackParamList>,
	BottomTabScreenProps<RootTabParamList, "MainTab">
>

export default
	withStatusBar(
	observer<Props>(
	function MainScreen({ navigation }) {
		const { coin, dapp, settings, validators } = useStore()
		// need culc by wallet

		const [activeTab, setActiveTab] = useState<ValueTabs>("Coins")

		const { t } = useTranslation()

		// ------------- bottom sheet -----------
		const gbs = useGlobalBottomsheet()

		const safeAreaInsets = useSafeAreaInsets()
		const sendCoinContainerStyle = useMemo(
			() => ({ paddingBottom: safeAreaInsets.bottom }),
			[safeAreaInsets.bottom],
		)

		const openSendModal = useCallback(() => openSend(sendCoinContainerStyle), [])
		const openSendIbcModal = useCallback(() => openSendIbc(sendCoinContainerStyle), [])

		const closeGlobalBottomSheet = useCallback(() => gbs.close(), [])

		const openReceive = useCallback(async () => {
			gbs.backHandler = () => gbs.close()

			await gbs.setProps({
				snapPoints: ["85%"],
				onClose: async () => {
					gbs.removeBackHandler()
				},
				children: () => (
					<ReceiveModal style={sendCoinContainerStyle} close={closeGlobalBottomSheet} />
				),
			})
			requestAnimationFrame(() => gbs.expand())
		}, [])

		const openScannerMemorized = useCallback(
			() =>
				navigation.navigate("ScannerQR", {
					onBarCodeScanned: (uri: string) => {
						try {
							if (uri.startsWith("wc")) {
								dapp.connect(uri)
							}
						} catch (e) {
							console.error("Catched", e)
						}
					},
				}),
			[],
		)

		const onPressClaim = () => {
			navigation.push("Loader", {
				// @ts-ignore
				callback: async () => {
					return await validators.claimAll()
				},
			})
		}

		const openScanner = coin.CanSend ? openScannerMemorized : undefined

		const openToolbar = useCallback(async () => {
			gbs.backHandler = () => gbs.close()

			const onPressScann = () => {
				openScanner && openScanner()
				Platform.OS === "android" && gbs.close()
			}

			await gbs.setProps({
				snapPoints: ["70%"],
				onClose: () => {
					gbs.removeBackHandler()
				},
				children: () => (
					<ToolbarFull
						style={styles.toolbar_full}
						onPressSend={openSendModal}
						onPressSendIbc={openSendModal}
						onPressReceive={openReceive}
						onPressInquire={undefined}
						onPressScan={onPressScann}
						onPressClaim={validators.totalReward > 0 ? onPressClaim : undefined}
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
				onDone: async () => await validators.claimAll(),
				navigation,
			})
		}, [validators.totalReward])

		const [isRefreshing, setRefreshing] = useState(false)

		const onRefresh = useCallback(async () => {
			setRefreshing(true)
			await coin.updateBalances()
			setRefreshing(false)
		}, [])

		const rewards = validators.totalRewardAsDollars

		const titleExtractor = useCallback((tab: ValueTabs) =>
		{
			if(tab === "Coins") return t("Coins")
			if(tab === "Fan Tokens") return t("FanTokens")
			return ""
		}, [])
		return (
			<SafeAreaView style={styles.container}>
				<BottomNavigator
					refreshControl={
						<RefreshControl
							tintColor={COLOR.White}
							refreshing={isRefreshing}
							onRefresh={onRefresh}
						/>
					}>
						<View style={styles.info}>
							<Title
								title={formatNumber(coin.totalBalance) + " " + settings.prettyCurrency?.symbol}
								uppertitle={t("TotalBalance")}
								size={{title: 32, uppertitle: 18}}
								style={styles.mb34}
							></Title>
							{/* <Text style={styles.balance_variation}>Variation {variation} %</Text> */}

							<View style={[styles.reward]}>
								<Title
									title={formatNumber(rewards) + " " + settings.prettyCurrency?.symbol}
									uppertitle={t("Reward")}
									size={{title: 32, uppertitle: 16}}
								></Title>
								<Button uppercase size="thin" disable={!validators.CanStake || rewards <= 0} onPress={openClaimAll}>
									{t("Claim")}
								</Button>
							</View>
						</View>
						<ToolbarShort
							style={styles.toolbar_short}
							onPressAll={openToolbar}
							onPressInquire={undefined}
							onPressReceive={openReceive}
							onPressScan={openScanner}
							onPressSend={openSendModal}
							onPressSendIbc={openSendIbcModal}
						/>
						<Tabs
							values={tabs}
							active={activeTab}
							titleExtractor={titleExtractor}
							onPress={setActiveTab}
							style={styles.tabs}
						/>

						<View style={styles.coins}>
							{coin.multiChainCoins
								.filter((c) => c.balance > 0 || c.info.coin == SupportedCoins.BITSONG || c.info.coin == SupportedCoins.BITSONG_TESTNET)
								.map((coin) => (
									<TouchableOpacity key={coin.info._id} disabled={true}>
										<CoinStat coin={coin} style={{ marginBottom: 9 }} />
									</TouchableOpacity>
								))}
						</View>
				</BottomNavigator>
			</SafeAreaView>
		)
	}
))

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.Dark3,
	},
	info: {
		marginBottom: vs(60),
	},
	balance: {
		marginBottom: vs(34),
	},
	balance_title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "400",
		fontSize: s(18),
		lineHeight: s(23),
		color: COLOR.RoyalBlue2,

		marginBottom: vs(10),
	},
	balance_value: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(42),
		lineHeight: s(53),
		color: COLOR.White,

		marginBottom: vs(6),
	},
	balance_variation: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: s(14),
		lineHeight: s(18),
		color: COLOR.White,
		opacity: 0.5,
	},
	mb34: {
		marginBottom: vs(34),
	},
	reward: {
		justifyContent: "space-between",
		alignItems: "flex-end",
		flexDirection: "row",
	},

	toolbar_short: {
		marginBottom: vs(40),
	},
	toolbar_full: {
		flex: 1,
	},

	tabs: {
		marginBottom: vs(18),
	},
	coins: {
		paddingTop: vs(8),
	},
})
