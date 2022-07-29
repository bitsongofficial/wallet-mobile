import { useCallback, useEffect, useMemo, useState } from "react"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { Observer, observer } from "mobx-react-lite"
import { FlatList, ListRenderItem, Platform, RefreshControl, SafeAreaView, StyleSheet, View } from "react-native"
import { RootStackParamList, RootTabParamList } from "types"
import { COLOR } from "utils"
import { Validator as ValidatorItem } from "components/organisms"
import { useGlobalBottomsheet, useStore } from "hooks"
import { Title, Toolbar } from "./components"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { Validator } from "core/types/coin/cosmos/Validator"
import { openClaim, openDelegateWithValidator } from "modals/validator"
import { openRedelegateWithValidator, openUndelegateWithValidator } from "modals/validator/withValidator"
import { toJS } from "mobx"

type Props = CompositeScreenProps<
	NativeStackScreenProps<RootStackParamList>,
	BottomTabScreenProps<RootTabParamList, "StackingTab">
>

export default observer<Props>(function Stacking({ navigation }) {
	const {validators} = useStore()
	const gbs = useGlobalBottomsheet()

	const openClaimModal = (item: Validator) => {
		openClaim({
			amount: validators.validatorReward(item),
			coinName: "BTSG",
			onDone: () => {
				validators.claim(item)
			},
			navigation,
		})
	}

	const [isRefreshing, setRefreshing] = useState(false)

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		await validators.load()
		setRefreshing(false)
	}, [])

	const openBottomSheet = useCallback(async (item) => {
		await gbs.setProps({
			snapPoints: [254],
			children: () => (
				<Toolbar
					style={{ marginHorizontal: 30 }}
					onPressClaim={
						() => {openClaimModal(item)}
					}
					onPressStake={
						() => {openDelegateWithValidator(item, navigation)}
					}
					onPressUnstake={
						() => (openUndelegateWithValidator(item, navigation))
					}
					onPressRestake={
						() => (openRedelegateWithValidator(item, navigation))
					}
				/>
			),
		})
		gbs.snapToIndex(0)
	}, [])

	const navToValidator = useCallback(
		(id: string) =>
		{
			navigation.navigate("Validator", { id })
		},
		[],
	)

	const renderValidators = useCallback<ListRenderItem<string>>(
		({item}) => {
			return (
				<TouchableOpacity key={item} onPress={() => navToValidator(item)}>
					<ValidatorItem id={item} onPressKebab={openBottomSheet} />
				</TouchableOpacity>
			)
		},
		[],
	)

	// console.log("A", validators.validators.map(v => v.id))
	// console.log(validators.validators.map(v => v.logo))

	return (
		<>
			<StatusBar style="light" />

			<SafeAreaView style={styles.container}>
				<View style={styles.wrapper}>
					<Title style={styles.title}>Validators</Title>
					{/* <ScrollView>
						{validators.validatorsIds.map(
							(id) => (
								<TouchableOpacity key={id} onPress={() => navToValidator(id)}>
									<ValidatorItem id={id} onPressKebab={openBottomSheet} />
								</TouchableOpacity>
							)
						)}
						<View style={{height: 80}}></View>
					</ScrollView> */}
					<FlatList keyExtractor={item => item} data={validators.validatorsIds} renderItem={renderValidators}
						refreshControl={
							<RefreshControl
								tintColor={COLOR.White}
								refreshing={isRefreshing}
								onRefresh={onRefresh}
							/>
						}
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

	wrapper: {
		paddingTop: 40, // for header
		paddingHorizontal: 30,
	},
	title: {
		marginTop: Platform.OS === "ios" ? 30 : 60,
		marginBottom: 24,
	},
})
