import { useCallback, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { useCachedResources, useStore } from "hooks"
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
import { navigate } from "navigation/utils"

type Props = NativeStackScreenProps<RootStackParamList, "Splash">

export default observer<Props>(function SplashScreen({ navigation }) {
	return (
		<>
			<StatusBar style="light" />
			<SafeAreaView style={styles.container}>
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
