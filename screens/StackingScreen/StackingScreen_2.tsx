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

type Props = CompositeScreenProps<
	NativeStackScreenProps<RootStackParamList>,
	BottomTabScreenProps<RootTabParamList, "StackingTab">
>

type Validator = {
	_id: string // address
	name: string
	logo: string
	apr: number
	voting_power: number
}

const data: Validator[] = [
	{
		_id: "1",
		logo: "",
		name: "",
		apr: 33.83,
		voting_power: 10.64,
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
	const renderValidators = useCallback<ListRenderItem<Validator>>(
		({ item }) => <Validator item={item} onPressKebab={openBottomSheet} />,
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
