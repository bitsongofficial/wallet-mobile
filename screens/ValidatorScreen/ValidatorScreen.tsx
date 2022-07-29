import { useCallback, useEffect, useMemo, useState } from "react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import { Image, ListRenderItem, Platform, SafeAreaView, StyleSheet, Text, View } from "react-native"
import { RootStackParamList } from "types"
import { COLOR, hexAlpha } from "utils"
import { CardAddress, CardClaim, CardDelegation, CardInfo } from "./components/moleculs"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import { Validator } from "core/types/coin/cosmos/Validator"
import moment from "moment"
import { ButtonBack } from "components/atoms"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Stat } from "./components/atoms"
import {
	openDelegateWithValidator,
	openRedelegate,
	openRedelegateWithValidator,
	openUndelegate,
	openClaim,
	DelegateController,
	RedelegateController,
	UndelegateController,
} from "modals/validator"
import { useStore } from "hooks"
import { SupportedCoins } from "constants/Coins"
import * as Clipboard from "expo-clipboard"
import { CoinClasses } from "core/types/coin/Dictionaries"
import { CoinOperationEnum } from "core/types/coin/OperationTypes"
import { DelegateData } from "core/types/coin/cosmos/DelegateData"
import { convertRateFromDenom } from "core/utils/Coin"
import { RedelegateData } from "core/types/coin/cosmos/RedelegateData"
import { openUndelegateWithValidator } from "modals/validator/withValidator"

type Props = NativeStackScreenProps<RootStackParamList, "Validator">

type IData = {
	title: string
	value: string
}

export default observer<Props>(function Stacking({ navigation, route }) {

	// --------- Modals --------------

	const openClaimModal = useCallback(() => {
		openClaim({
			amount: 12345,
			coinName: "BTSG",
		})
	}, [])
	const { validators, wallet } = useStore()
	const validator = route.params.validator
	const [address, setAddress] = useState("")

	useEffect(() =>
	{
		(async () =>
		{
			setAddress(await wallet.activeWallet?.wallets[validator.chain ?? SupportedCoins.BITSONG].Address())
		})()
	}, [])

	const onPressClaim = () => (validators.claim(validator))

	// --------- Modals --------------

	const openDelegateModal = () => (openDelegateWithValidator(validator, navigation))

	const openRedelegateModal = () => (openRedelegateWithValidator(validator, navigation))

	const openUndelegateModal = () => (openUndelegateWithValidator(validator, navigation))

	// =======================================

	const data = useMemo<IData[]>(
		() => [
			{ title: "APR", value: `${validator.apr.toFixed(2)}%` },
			{ title: "VOTING POWER", value: `${validators.percentageVotingPower(validator).toFixed(1)}%` },
			{ title: "TOTAL STAKE", value: `$${validators.totalStakeAsFIAT(validator)}` },
		],
		[validator.apr, validator.tokens],
	)

	const renderInfo = useCallback<ListRenderItem<IData>>(
		({ item }) => (
			<CardInfo style={item.title !== "TOTAL STAKE" && styles.info} key={item.title} {...item} />
		),
		[],
	)

	const goBack = useCallback(() => navigation.goBack(), [])

	const insets = useSafeAreaInsets()

	const source = validator.logo ? {uri: validator.logo} : undefined

	return (
		<>
			<StatusBar style="light" />

			<SafeAreaView style={styles.container}>
				<ScrollView style={styles.scrollview} contentContainerStyle={styles.scrollviewContent}>
					<View style={styles.wrapper}>
						<View style={styles.head}>
							<View style={styles.avatarContainer}>
								<View style={styles.avatar} >
									{source && <Image source={source} />}
								</View>
							</View>

							<View style={{ justifyContent: "center" }}>
								<View style={styles.validatorNameContainer}>
									<Text style={styles.validatorName}>{validator.name ? validator.name : validator.id}</Text>
									<View style={styles.badge}>
										<Text style={styles.badgeText}>{validator.status.statusDetailed}</Text>
									</View>
								</View>
								<View>
									<Text style={styles.tag}>{validator.description}</Text>
								</View>
							</View>
						</View>

						<CardClaim style={styles.claim} onPressClaim={onPressClaim} value={validators.validatorReward(validator)} />

						<CardDelegation
							value={validators.validatorDelegations(validator)}
							style={styles.delegation}
							onPressStake={openDelegateModal}
							onPressUnstake={openUndelegateModal}
							onPressRestake={openRedelegateModal}
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
		backgroundColor: "red",
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
