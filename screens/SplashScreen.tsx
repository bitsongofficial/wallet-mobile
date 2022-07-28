import { useCallback, useEffect } from "react"
import { StyleSheet, View } from "react-native"
import { useStore } from "hooks"
import { SafeAreaView } from "react-native-safe-area-context"
import { observer } from "mobx-react-lite"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "types"
import { COLOR } from "utils"
import { autorun } from "mobx"
import { Icon } from "components/atoms"
import { StatusBar } from "expo-status-bar"
import { isBiometricAvailable } from "utils/biometrics"
import { useAsyncStorage } from "@react-native-async-storage/async-storage"

type Props = NativeStackScreenProps<RootStackParamList, "Splash">

export default observer<Props>(function SplashScreen({ navigation }) {
	const {localStorageManager, wallet} = useStore()

	const mainScreen = useCallback(() => navigation.replace("Root"), [])
	const start = useCallback(() => navigation.replace("Start"), [])
	const storage = useAsyncStorage("a")

	useEffect(() => {
		console.log("Run")
		const dismiss = autorun(() => {
			if (wallet.firstLoad) {
				if (wallet.wallets.length > 0) mainScreen()
				else start()
				if(dismiss) dismiss()
			}
			else
			{
				setTimeout(() => {localStorageManager.initialLoad()}, 1500)
			}
		})

		return () => {
			if (dismiss) dismiss()
		}
	})

	return (
		<>
			<StatusBar style="light" />
			<SafeAreaView style={styles.container}>
				<View style={styles.center}>
					<Icon name="cosmo" size={120} />
				</View>
			</SafeAreaView>
		</>
	)
})

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLOR.Dark3,
		justifyContent: "center",
	},
	center: {
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
})
