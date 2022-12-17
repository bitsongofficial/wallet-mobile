import "./shim"

import { StatusBar } from "expo-status-bar"
import { Platform, StyleSheet, BackHandler } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { autorun, configure, toJS } from "mobx"
import useCachedResources from "./hooks/useCachedResources"
import useColorScheme from "./hooks/useColorScheme"
import Navigation from "./navigation"
import { useEffect, useState } from "react"
import { COLOR } from "utils"
import * as NavigationBar from "expo-navigation-bar"
import { useGlobalBottomsheet, useLoading, useStore, useTheme } from "hooks"
import { observer } from "mobx-react-lite"
import { AlertView, BottomSheet } from "components/moleculs"
import { gav as globalAlert } from "modals"
import * as SplashScreen from 'expo-splash-screen'
import { navigate, navigationRef } from "navigation/utils"
import { RootStackParamList } from "types"

configure({ useProxies: "ifavailable" })

SplashScreen.preventAutoHideAsync()

const App = observer(() => {
	const {localStorageManager, wallet} = useStore()
	const [startRoute, setStartRoute] = useState<keyof RootStackParamList>()
	const [navigated, setNavigated] = useState<boolean>(false)
	const isLoadingComplete = useCachedResources()
	const colorScheme = useColorScheme()

	const bottomsheet = useGlobalBottomsheet()

	useEffect(() =>
	{
		let dismiss: any
		try
		{
			dismiss = autorun(() => {
				if (wallet.loadedFromMemory) {
					if (wallet.profiles.length > 0) setStartRoute("Root")
					else setStartRoute("Start")
					if(dismiss) dismiss()
				}
				else
				{
					localStorageManager.initialLoad()
				}
			})
		}
		catch (e)
		{
			console.error("Catched", e)
		}

		return () =>
		{
			if(dismiss) dismiss()
		}
	})

	useEffect(() => {
		if (Platform.OS === "android") {
			NavigationBar.setBackgroundColorAsync(COLOR.Dark3)
		}
	}, [])

	useEffect(() =>
	{
		if(isLoadingComplete && wallet.loadedFromMemory)
		{
			SplashScreen.hideAsync()
		}
	}, [isLoadingComplete, startRoute])

	useEffect(() =>
	{
		if(navigationRef && !navigated && isLoadingComplete && ((wallet.pinAsked && startRoute == "Root") || startRoute == "Start"))
		{
			setNavigated(true)
			navigate(startRoute)
		}
	}, [isLoadingComplete, navigated, wallet.pinAsked, startRoute, navigationRef])

	useEffect(() => {
		const backHandler = bottomsheet.backHandler
		if (backHandler) {
			const handler = BackHandler.addEventListener("hardwareBackPress", () => {
				const result = backHandler()
				return result !== undefined ? result : true
			})
			return () => handler.remove()
		}
	}, [bottomsheet.backHandler])

	const theme = useTheme()
	return (
		<GestureHandlerRootView style={[styles.gestureHandler, theme.appBackground]}>
			<SafeAreaProvider>
				<StatusBar />
				<Navigation colorScheme={colorScheme} />
				{!!globalAlert.text && <AlertView message={globalAlert.text} />}
				<BottomSheet
					{...toJS(bottomsheet.defaultProps)}
					{...toJS(bottomsheet.props)}
					children={bottomsheet.children}
					ref={bottomsheet.ref}
				/>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
})

const styles = StyleSheet.create({
	gestureHandler: { flex: 1 },
	loaderContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
})

export default App
