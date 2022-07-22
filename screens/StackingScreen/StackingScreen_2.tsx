import { useCallback } from "react"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import { FlatList, ListRenderItem, Platform, SafeAreaView, StyleSheet, View } from "react-native"
import { RootStackParamList, RootTabParamList } from "types"
import { COLOR } from "utils"
import { Validator } from "components/organisms"
import { useGlobalBottomsheet } from "hooks"
import { Title, Toolbar } from "./components"
import { IValidator } from "classes/types"
import { TouchableOpacity } from "react-native-gesture-handler"

type Props = CompositeScreenProps<
	NativeStackScreenProps<RootStackParamList>,
	BottomTabScreenProps<RootTabParamList, "StackingTab">
>

const data: IValidator[] = [
	{
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
	},
]

export default observer<Props>(function Stacking({ navigation }) {
	const gbs = useGlobalBottomsheet()

	const openBottomSheet = useCallback(async (item) => {
		await gbs.setProps({
			snapPoints: [254],
			children: () => (
				<Toolbar
					style={{ marginHorizontal: 30 }}
					onPressClaim={() => {}}
					onPressStake={() => {}}
					onPressUnstake={() => {}}
					onPressRestake={() => {}}
				/>
			),
		})
		gbs.snapToIndex(0)
	}, [])

	const navToValidator = useCallback(
		(validator: IValidator) => navigation.push("Validator", { validator }),
		[],
	)

	const renderValidators = useCallback<ListRenderItem<IValidator>>(
		({ item }) => (
			<TouchableOpacity onPress={() => navToValidator(item)}>
				<Validator item={item} onPressKebab={openBottomSheet} />
			</TouchableOpacity>
		),
		[],
	)

	return (
		<>
			<StatusBar style="light" />

			<SafeAreaView style={styles.container}>
				<View style={styles.wrapper}>
					<Title style={styles.title}>Validators</Title>

					<FlatList data={data} renderItem={renderValidators} />
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
