import { useCallback, useMemo, useState } from "react"
import { ListRenderItem, RefreshControl, StyleSheet, ViewStyle } from "react-native"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { useHeaderHeight } from "@react-navigation/elements"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import Animated from "react-native-reanimated"
import { TouchableOpacity } from "react-native-gesture-handler"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import { RootStackParamList, RootTabParamList } from "types"
import { COLOR } from "utils"
import { Validator, ValidatorStatus } from "core/types/coin/cosmos/Validator"
import { openClaim, openDelegateWithValidator } from "modals/validator"
import {
	openRedelegateWithValidator,
	openUndelegateWithValidator,
} from "modals/validator/withValidator"
import { SupportedCoins } from "constants/Coins"
import { useAnimateFlatlist, useGlobalBottomsheet, useStore } from "hooks"
import { Shadow } from "components/atoms"
import { Validator as ValidatorItem } from "components/organisms"
import { Title, Toolbar } from "./components"

type Props = CompositeScreenProps<
	NativeStackScreenProps<RootStackParamList>,
	BottomTabScreenProps<RootTabParamList, "ValidatorsList">
>

export default observer<Props>(function ValidatorsListScreen({ navigation }) {
	const { validators } = useStore()

	// ------------------ Refresh -------------------

	const [isRefreshing, setRefreshing] = useState(false)
	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		await validators.update()
		setRefreshing(false)
	}, [])

	// ------------------ Data ----------------------

	const navToValidator = ({ id }: Validator) => navigation.navigate("Validator", { id })
	const renderValidators = useCallback<ListRenderItem<Validator>>(
		({ item }) => (
			<TouchableOpacity key={item.id} onPress={() => navToValidator(item)} style={styles.validator}>
				<ValidatorItem item={item} onPressKebab={openBottomSheet} />
			</TouchableOpacity>
		),
		[],
	)

	// ----------------- Bottomsheets ----------------

	const openClaimModal = (item: Validator) =>
		openClaim({
			amount: validators.validatorReward(item),
			coinName: "BTSG",
			onDone: () => validators.claim(item),
			navigation,
		})

	const gbs = useGlobalBottomsheet()
	const openBottomSheet = useCallback((validator: Validator) => {
		gbs.setProps({
			snapPoints: [254],
			children: () => (
				<Toolbar
					style={{ marginHorizontal: 30 }}
					onPressClaim={
						validators.CanStake && validators.validatorReward(validator) > 0 ?
						(() => {openClaimModal(validator)})
						: undefined
					}
					onPressStake={
						validators.CanStake ?
						() => {openDelegateWithValidator(validator, navigation)}
						: undefined
					}
					onPressUnstake={
						validators.CanStake && validators.validatorDelegations(validator) > 0 ?
						() => (openUndelegateWithValidator(validator, navigation))
						: undefined
					}
					onPressRestake={
						validators.CanStake && validators.validatorDelegations(validator) > 0 ?
						() => (openRedelegateWithValidator(validator, navigation))
						: undefined
					}
				/>
			),
		})
		requestAnimationFrame(() => gbs.snapToIndex(0))
	}, [validators.CanStake])

	// -------------- Styles --------------

	const flatlistContentStyle = useMemo<ViewStyle>(
		() => ({
			paddingTop: 23,
			paddingHorizontal: 30,
			paddingBottom: 100,
		}),
		[],
	)

	const headerHeight = useHeaderHeight()
	const flatlistStyle = useMemo<ViewStyle>(
		() => ({
			marginTop: headerHeight,
			...styles.background,
		}),
		[headerHeight],
	)

	// ----------- Animated Styles --------
	const [scrollHandler, animStyles] = useAnimateFlatlist()

	return (
		<>
			<StatusBar style="light" />
			<Animated.FlatList
				onScroll={scrollHandler}
				refreshControl={
					<RefreshControl
						tintColor={COLOR.White}
						refreshing={isRefreshing}
						onRefresh={onRefresh}
						//
					/>
				}
				// ------------ Header -----------------
				stickyHeaderIndices={[0]}
				ListHeaderComponentStyle={styles.background}
				ListHeaderComponent={
					<>
						<Title style={styles.title}>Validators</Title>
						<Shadow style={animStyles.topShadow} />
					</>
				}
				// ------------- List -------------------
				keyExtractor={(item) => item.id}
				data={validators.validators}
				// data={mock}
				renderItem={renderValidators}
				// ------------ Styles --------------------
				style={flatlistStyle}
				contentContainerStyle={flatlistContentStyle}
			/>
			<Shadow style={animStyles.bottomShadow} invert />
		</>
	)
})

const styles = StyleSheet.create({
	background: { backgroundColor: COLOR.Dark3 },
	title: { marginBottom: 24 },
	validator: { marginBottom: 20 },
})
const mock: Validator[] = [
	{
		id: "1",
		commission: {
			change: {
				last: new Date(),
				max: 5,
			},
			rate: {
				current: 4,
				max: 5,
			},
		},
		description: "description",
		identity: "identity",
		logo: "logo",
		name: "name",
		operator: "operator",
		status: {
			status: ValidatorStatus.ACTIVE,
			statusDetailed: "statusDetailed",
		},
		tokens: 1234567890,
		userClaimAmount: 123456789,
		userDelegation: 12345678,
		chain: SupportedCoins.BITSONG,
		signingInfo: {
			address: "address",
			index_offset: "index_offset",
			jailed_until: "jailed_until",
			missed_blocks_counter: "missed_blocks_counter",
			start_height: "start_height",
			tombstoned: false,
		},
	},
	{
		id: "2",
		commission: {
			change: {
				last: new Date(),
				max: 5,
			},
			rate: {
				current: 4,
				max: 5,
			},
		},
		description: "description",
		identity: "identity",
		logo: "logo",
		name: "name",
		operator: "operator",
		status: {
			status: ValidatorStatus.ACTIVE,
			statusDetailed: "statusDetailed",
		},
		tokens: 1234567890,
		userClaimAmount: 123456789,
		userDelegation: 12345678,
		chain: SupportedCoins.BITSONG,
		signingInfo: {
			address: "address",
			index_offset: "index_offset",
			jailed_until: "jailed_until",
			missed_blocks_counter: "missed_blocks_counter",
			start_height: "start_height",
			tombstoned: false,
		},
	},
	{
		id: "3",
		commission: {
			change: {
				last: new Date(),
				max: 5,
			},
			rate: {
				current: 4,
				max: 5,
			},
		},
		description: "description",
		identity: "identity",
		logo: "logo",
		name: "name",
		operator: "operator",
		status: {
			status: ValidatorStatus.ACTIVE,
			statusDetailed: "statusDetailed",
		},
		tokens: 1234567890,
		userClaimAmount: 123456789,
		userDelegation: 12345678,
		chain: SupportedCoins.BITSONG,
		signingInfo: {
			address: "address",
			index_offset: "index_offset",
			jailed_until: "jailed_until",
			missed_blocks_counter: "missed_blocks_counter",
			start_height: "start_height",
			tombstoned: false,
		},
	},
	{
		id: "4",
		commission: {
			change: {
				last: new Date(),
				max: 5,
			},
			rate: {
				current: 4,
				max: 5,
			},
		},
		description: "description",
		identity: "identity",
		logo: "logo",
		name: "name",
		operator: "operator",
		status: {
			status: ValidatorStatus.ACTIVE,
			statusDetailed: "statusDetailed",
		},
		tokens: 1234567890,
		userClaimAmount: 123456789,
		userDelegation: 12345678,
		chain: SupportedCoins.BITSONG,
		signingInfo: {
			address: "address",
			index_offset: "index_offset",
			jailed_until: "jailed_until",
			missed_blocks_counter: "missed_blocks_counter",
			start_height: "start_height",
			tombstoned: false,
		},
	},
]
