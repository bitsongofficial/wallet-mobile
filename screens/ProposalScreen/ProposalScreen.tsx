import { useCallback, useState } from "react"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import { observer } from "mobx-react-lite"
import { Platform, SafeAreaView, StyleSheet, Text, View } from "react-native"
import { RootStackParamList, RootTabParamList } from "types"
import { COLOR } from "utils"
import { RectButton, ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import { Icon2 } from "components/atoms"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { CardCoin, CardCommission, ITab, Tabs } from "./components/moleculs"

type Props = CompositeScreenProps<
	NativeStackScreenProps<RootStackParamList>,
	BottomTabScreenProps<RootTabParamList, "Proposal">
>

export default observer<Props>(function Stacking({ navigation }) {
	const goBack = useCallback(() => navigation.goBack(), [])

	const insets = useSafeAreaInsets()

	const [activeTab, setActiveTab] = useState<ITab>("All")

	const navToNew = useCallback(() => navigation.navigate("NewProposal"), [])

	return (
		<>
			<StatusBar style="light" />

			<SafeAreaView style={styles.safearea}>
				<View style={styles.container}>
					<View style={styles.wrapper}>
						<View style={styles.head}>
							<Text style={styles.title}>Proposals</Text>
							<TouchableOpacity style={styles.buttonPlus} onPress={navToNew}>
								<Icon2 name="plus" stroke={COLOR.White} size={18} />
							</TouchableOpacity>
						</View>
					</View>

					<Tabs
						active={activeTab}
						onPress={setActiveTab}
						style={styles.wrapper}
						//
					/>

					<ScrollView style={styles.wrapper}>
						<RectButton style={{ marginBottom: 30 }}>
							<CardCoin title="BitSong" />
						</RectButton>

						<CardCommission style={{ marginBottom: 20 }} />
						<CardCommission />
					</ScrollView>
				</View>
			</SafeAreaView>
		</>
	)
})

const styles = StyleSheet.create({
	safearea: {
		flex: 1,
		backgroundColor: COLOR.Dark3,
	},
	container: {
		paddingTop: 40, // for header
		marginTop: Platform.OS === "ios" ? 30 : 60,
	},

	head: {
		flexDirection: "row",
		justifyContent: "space-between",
	},

	wrapper: {
		paddingHorizontal: 30,
	},

	buttonPlus: {
		width: 26,
		height: 26,
		borderRadius: 26,
		backgroundColor: COLOR.Dark2,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontFamily: "CircularStd",
		fontStyle: "normal",
		fontWeight: "500",
		fontSize: 18,
		color: COLOR.White,
	},
})
