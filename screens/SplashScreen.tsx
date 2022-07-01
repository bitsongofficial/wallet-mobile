import { useCallback, useEffect, useMemo } from "react";
import {
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useStore } from "hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import { observer } from "mobx-react-lite";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
// @ts-ignore
import { COLOR } from "utils";
import { autorun, IReactionDisposer } from "mobx";
import { Icon } from "components/atoms";
import { StatusBar } from "expo-status-bar";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

const points = [270];

export default observer<Props>(function SplashScreen({ navigation }) {
	const {wallet} = useStore()

	const mainScreen = useCallback(
		() => navigation.replace("Root"),
		[]
	);
	const start = useCallback(
		() => navigation.replace("Start"),
		[]
	);

	useEffect(() =>
	{
		const dismiss = autorun(() =>
		{
			if(wallet.firstLoad)
			{
				if(wallet.wallets.length > 0) mainScreen()
				else start()
				if(dismiss) dismiss()
			}
			else
			{
				wallet.loadWallets()
			}
		})

		return () =>
		{
			if(dismiss) dismiss()
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
	);
});

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
});
