import { useCallback, useEffect, useMemo, useState } from "react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import {
	Image,
	ListRenderItem,
	Platform,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native"
import { RootStackParamList } from "types"
import { COLOR, hexAlpha } from "utils"
import { CardAddress, CardClaim, CardDelegation, CardInfo } from "./components/moleculs"
import { FlatList } from "react-native-gesture-handler"
import { Validator } from "core/types/coin/cosmos/Validator"
import moment from "moment"
import { ButtonBack } from "components/atoms"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Stat } from "./components/atoms"
import { openDelegateWithValidator, openRedelegateWithValidator, openClaim } from "modals/validator"
import { useStore } from "hooks"
import { SupportedCoins } from "constants/Coins"
import * as Clipboard from "expo-clipboard"
import { openUndelegateWithValidator } from "modals/validator/withValidator"
import { formatNumber } from "utils/numbers"

type Props = NativeStackScreenProps<RootStackParamList, "Validator">

type IData = {
	title: string
	value: string
}

export default observer<Props>(function Stacking({ navigation, route }) {
	const { validators, wallet, settings } = useStore()
	const validator = validators.resolveValidator(route.params.id) ?? validators.validators[0]
	const [address, setAddress] = useState("")

	useEffect(() => {
		;(async () => {
			setAddress(
				await wallet.activeWallet?.wallets[validator.chain ?? SupportedCoins.BITSONG].Address(),
			)
		})()
	}, [])

	// --------- Modals --------------
	const onPressClaim = async () => (await validators.claim(validator))

	const openClaimModal = () => {
		openClaim({
			amount: validators.validatorReward(validator),
			coinName: "BTSG",
			onDone: onPressClaim,
			navigation,
		})
	}

	// --------- Modals --------------

	const openDelegateModal = () => openDelegateWithValidator(validator, navigation)

	const openRedelegateModal = () => openRedelegateWithValidator(validator, navigation)

	const openUndelegateModal = () => openUndelegateWithValidator(validator, navigation)

	// =======================================

	const data = useMemo<IData[]>(
		() => [
			{ title: "APR", value: `${validators.apr(validator).toFixed(2)}%` },
			{
				title: "VOTING POWER",
				value: `${validators.percentageVotingPower(validator).toFixed(1)}%`,
			},
			{
				title: "TOTAL STAKE",
				value: `${settings.currency?.symbol}${formatNumber(
					validators.totalStakeAsFIAT(validator),
				)}`,
			},
		],
		[validator, validator.commission.rate.current, validator.tokens],
	)

	const renderInfo = useCallback<ListRenderItem<IData>>(
		({ item }) => (
			<CardInfo style={item.title !== "TOTAL STAKE" && styles.info} key={item.title} {...item} />
		),
		[],
	)

	const goBack = useCallback(() => navigation.goBack(), [])

	const insets = useSafeAreaInsets()

	const source = validator.logo ? { uri: validator.logo } : undefined

	const [isRefreshing, setRefreshing] = useState(false)

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		await validators.update()
		setRefreshing(false)
	}, [])

	const delegations = validators.validatorDelegations(validator)

	return (
		<>
			<StatusBar style="light" />

			<SafeAreaView style={styles.container}>
				<ScrollView
					style={styles.scrollview}
					contentContainerStyle={styles.scrollviewContent}
					refreshControl={
						<RefreshControl
							tintColor={COLOR.White}
							refreshing={isRefreshing}
							onRefresh={onRefresh}
						/>
					}
				>
					<View style={styles.wrapper}>
						<View style={styles.head}>
							<View style={styles.avatarContainer}>
								{source && <Image style={styles.avatar} source={source} />}
							</View>

							<View style={{ flexShrink: 1, justifyContent: "center" }}>
								<View style={styles.validatorNameContainer}>
									<Text style={styles.validatorName}>{validator.id}</Text>
									<View style={styles.badge}>
										<Text style={styles.badgeText}>{validator.status.statusDetailed}</Text>
									</View>
								</View>
								<View>
									<Text style={[styles.tag, { flex: 1 }]}>{validator.description}</Text>
								</View>
							</View>
						</View>

						<CardClaim
							style={styles.claim}
							onPressClaim={openClaimModal}
							value={validators.validatorReward(validator)}
							coin={validator.chain}
						/>

						<CardDelegation
							value={validators.validatorDelegations(validator)}
							coin={validator.chain}
							style={styles.delegation}
							onPressStake={validators.CanStake ? openDelegateModal : undefined}
							onPressUnstake={validators.CanStake && delegations > 0 ? openUndelegateModal : undefined}
							onPressRestake={validators.CanStake && delegations > 0 ? openRedelegateModal : undefined}
						/>

						<Text style={styles.titleList}>Validator Info</Text>
					</View>

					<FlatList
						style={styles.flatlist}
						contentContainerStyle={[styles.flatlistContent, styles.wrapper]}
						horizontal
						data={data}
						renderItem={renderInfo}
					/>

					<View style={styles.wrapper}>
						<CardAddress
							title="OPERATION ADDRESS"
							onPress={() => {
								Clipboard.setStringAsync(validator.operator)
							}}
							value={validator.operator}
							style={styles.address}
						/>
						<CardAddress
							title="ACCOUNT ADDRESS"
							onPress={() => {
								Clipboard.setStringAsync(validator.operator)
							}}
							value={address}
							style={styles.address}
						/>

						<View style={{ marginHorizontal: 10, marginTop: 10 }}>
							{/* <Stat
								style={styles.stat}
								title="Uptime"
								value={validator.uptime + "%"}
								//
							/> */}
							<Stat
								style={styles.stat}
								title="Max Conversion Rate"
								value={validator.commission.rate.max + "%"}
							/>
							<Stat
								style={styles.stat}
								title="Current Commission Rate"
								value={validator.commission.rate.current + "%"}
							/>
							<Stat
								style={styles.stat}
								title="Last Commission Change"
								value={moment(validator.commission.change.last).fromNow()}
							/>
						</View>
					</View>
				</ScrollView>
				<View style={[{ position: "absolute", bottom: insets.bottom }, styles.wrapper]}>
					<ButtonBack
						onPress={goBack}
						style={styles.buttonBack}
						textStyle={{ color: COLOR.Dark3 }}
						stroke={COLOR.Dark3}
					/>
				</View>
			</SafeAreaView>
		</>
	)
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.Dark3,
	},
	scrollview: {
		paddingTop: 40, // for header
	},
	scrollviewContent: {
		paddingBottom: 40,
	},

	wrapper: {
		paddingHorizontal: 30,
	},
	title: {
		marginTop: Platform.OS === "ios" ? 30 : 60,
		marginBottom: 24,
	},

	head: {
		flexDirection: "row",
		justifyContent: "flex-start",
		width: "100%",
		marginBottom: 33,
	},

	avatarContainer: {
		width: 80,
		height: 80,
		borderRadius: 80,

		justifyContent: "center",
		alignItems: "center",
		backgroundColor: COLOR.Dark2,

		marginRight: 24,
	},
	avatar: {
		width: 54,
		height: 54,
		borderRadius: 54,
		backgroundColor: COLOR.Dark3,
	},

	validatorNameContainer: {
		flexDirection: "row",
		marginBottom: 10,
	},

	validatorName: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 20,
		lineHeight: 25,

		color: COLOR.White,
		marginRight: 12,
	},

	badge: {
		backgroundColor: COLOR.LightGreyBlue,
		paddingHorizontal: 12,
		paddingVertical: 5,
		borderRadius: 25,
		alignItems: "center",
		justifyContent: "center",
	},
	badgeText: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "700",
		fontSize: 8,
		lineHeight: 10,
		color: COLOR.White,
	},

	tag: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 15,
		lineHeight: 19,
		color: hexAlpha(COLOR.PaleBlue, 50),
	},

	claim: {
		marginBottom: 25,
	},
	delegation: {
		marginBottom: 38,
	},
	titleList: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 16,
		lineHeight: 20,

		color: COLOR.White,
		marginBottom: 9,
		marginLeft: 10,
	},

	flatlistContent: {
		paddingVertical: 10,
	},
	flatlist: {
		marginBottom: 15,
	},
	info: {
		marginRight: 20,
	},

	address: {
		marginBottom: 25,
	},

	stat: {
		marginBottom: 26,
	},

	buttonBack: {
		backgroundColor: COLOR.White,
		paddingHorizontal: 24,
		paddingVertical: 18,
		borderRadius: 50,
	},
})
