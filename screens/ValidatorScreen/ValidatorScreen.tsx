import { useCallback, useMemo } from "react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import { ListRenderItem, Platform, SafeAreaView, StyleSheet, Text, View } from "react-native"
import { RootStackParamList } from "types"
import { COLOR, hexAlpha } from "utils"
import { CardAddress, CardClaim, CardDelegation, CardInfo } from "./components/moleculs"
import { FlatList, ScrollView } from "react-native-gesture-handler"
import { IValidator } from "classes/types"
import moment from "moment"
import { ButtonBack } from "components/atoms"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Stat } from "./components/atoms"
import {
	openDelegate,
	openRedelegate,
	openUndelegate,
	openClaim,
	DelegateController,
	RedelegateController,
	UndelegateController,
} from "modals/validator"

type Props = NativeStackScreenProps<RootStackParamList, "Validator">

const mock: IValidator = {
	_id: "123",
	name: "Forbole",
	logo: "123451234",
	claim: 234.78,
	apr: 29.6,
	voting_power: 10.6,
	total: 4500000,
	address_operation: "bitsongval00000000000000000za9ssklclsd",
	address_account: "bitsongval00000000000000000za9ssklclsd",
	uptime: 100,
	maxConvertionRate: 100,
	currentCommissionRate: 12.5,
	lastCommissionChange: "Sun Oct 31 2021 00:00:00 GMT+0300",
}

type IData = {
	title: string
	value: string
}

export default observer<Props>(function Stacking({ navigation, route }) {
	const validator = mock // route.params.validator

	// --------- Modals --------------

	const openClaimModal = useCallback(() => {
		openClaim({
			amount: 12345,
			coinName: "BTSG",
		})
	}, [])

	const openDelegateModal = useCallback(() => {
		openDelegate({
			controller: new DelegateController(),
			onDone() {
				// nav to check pin with callback
			},
		})
	}, [])

	const openRedelegateModal = useCallback(() => {
		const controller = new RedelegateController()
		controller.setFrom(validator)

		openRedelegate({
			controller,
			onDone() {
				// nav to check pin with callback
			},
		})
	}, [])

	const openUndelegateModal = useCallback(() => {
		const controller = new UndelegateController()
		controller.setFrom(validator)

		openUndelegate({
			controller,
			onDone() {
				// nav to check pin with callback
			},
		})
	}, [])

	// =======================================

	const data = useMemo<IData[]>(
		() => [
			{ title: "APR", value: `${validator.apr}%` },
			{ title: "VOTING POWER", value: `${validator.voting_power}%` },
			{ title: "TOTAL STAKE", value: `$${validator.total}` },
		],
		[validator.apr, validator.voting_power, validator.total],
	)

	const renderInfo = useCallback<ListRenderItem<IData>>(
		({ item }) => (
			<CardInfo style={item.title !== "TOTAL STAKE" && styles.info} key={item.title} {...item} />
		),
		[],
	)

	const goBack = useCallback(() => navigation.goBack(), [])

	const insets = useSafeAreaInsets()

	return (
		<>
			<StatusBar style="light" />

			<SafeAreaView style={styles.container}>
				<ScrollView style={styles.scrollview} contentContainerStyle={styles.scrollviewContent}>
					<View style={styles.wrapper}>
						<View style={styles.head}>
							<View style={styles.avatarContainer}>
								<View style={styles.avatar} />
							</View>

							<View style={{ justifyContent: "center" }}>
								<View style={styles.validatorNameContainer}>
									<Text style={styles.validatorName}>{validator.name}</Text>
									<View style={styles.badge}>
										<Text style={styles.badgeText}>ACTIVE</Text>
									</View>
								</View>
								<View>
									<Text style={styles.tag}>Co-building the interchain</Text>
								</View>
							</View>
						</View>

						<CardClaim style={styles.claim} onPressClaim={openClaimModal} />

						<CardDelegation
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
							onPress={() => {}}
							value={validator.address_operation}
							style={styles.address}
						/>
						<CardAddress
							title="ACCOUNT ADDRESS"
							onPress={() => {}}
							value={validator.address_account}
							style={styles.address}
						/>

						<View style={{ marginHorizontal: 10, marginTop: 10 }}>
							<Stat
								style={styles.stat}
								title="Uptime"
								value={validator.uptime + "%"}
								//
							/>
							<Stat
								style={styles.stat}
								title="Max Conversion Rate"
								value={validator.maxConvertionRate + "%"}
							/>
							<Stat
								style={styles.stat}
								title="Current Commission Rate"
								value={validator.currentCommissionRate + "%"}
							/>
							<Stat
								style={styles.stat}
								title="Last Commission Change"
								value={moment(validator.lastCommissionChange).fromNow()}
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
