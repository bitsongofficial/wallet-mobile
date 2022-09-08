import "./shim"

import { StatusBar } from "expo-status-bar"
import { Platform, StyleSheet, View, BackHandler } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { configure, toJS } from "mobx"
import useCachedResources from "./hooks/useCachedResources"
import useColorScheme from "./hooks/useColorScheme"
import Navigation from "./navigation"
import { useEffect } from "react"
import { COLOR } from "utils"
import * as NavigationBar from "expo-navigation-bar"
import FullscreenOverlay from "components/atoms/FullscreenOverlay"
import { Loader } from "components/atoms"
import { useGlobalBottomsheet, useLoading, useTheme } from "hooks"
import { observer } from "mobx-react-lite"
import { AlertView, BottomSheet } from "components/moleculs"
import { gav as globalAlert } from "modals"

configure({ useProxies: "ifavailable" })

const App = observer(() => {
	const isLoadingComplete = useCachedResources()
	const colorScheme = useColorScheme()

	const loading = useLoading()
	const bottomsheet = useGlobalBottomsheet()

	useEffect(() => {
		if (Platform.OS === "android") {
			NavigationBar.setBackgroundColorAsync(COLOR.Dark3)
		}
	}, [])

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

	if (!isLoadingComplete) {
		return null
	} else {
		return (
			<GestureHandlerRootView style={[styles.gestureHandler, theme.appBackground]}>
				<SafeAreaProvider>
					<StatusBar />
					<Navigation colorScheme={colorScheme} />

					<FullscreenOverlay showing={loading.isOpen}>
						<View style={styles.loaderContainer}>
							<Loader size={60} />
						</View>
					</FullscreenOverlay>

					{globalAlert.isShow && <AlertView message={globalAlert.message} />}
					<BottomSheet
						{...toJS(bottomsheet.defaultProps)}
						{...toJS(bottomsheet.props)}
						children={bottomsheet.children}
						ref={bottomsheet.ref}
					/>
				</SafeAreaProvider>
			</GestureHandlerRootView>
		)
	}
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
