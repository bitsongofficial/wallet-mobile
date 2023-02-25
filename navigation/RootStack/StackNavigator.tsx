import {
	createNativeStackNavigator,
	NativeStackHeaderProps,
	NativeStackNavigationOptions,
} from "@react-navigation/native-stack"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import BottomTabNavigator from "navigation/BottomTab"
import * as Screens from "screens"
import { RootStackParamList } from "types"
import { Header } from "components/organisms"

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>()

const WithHeaderOption: NativeStackNavigationOptions = {
	headerShown: true,
	header: (props: NativeStackHeaderProps) => <Header {...props} />,
}

export default ({ initialRouteName }: { initialRouteName?: keyof RootStackParamList }) => (
	<BottomSheetModalProvider>
		<Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
			{/* not auth */}
			<Stack.Screen name="Splash" component={Screens.Splash} />
			<Stack.Screen name="Start" component={Screens.Start} />
			<Stack.Screen name="CreateWallet" component={Screens.CreateWallet} />
			<Stack.Screen name="PinRequest" component={Screens.Pin} />
			{/* auth */}
			<Stack.Screen name="ImportFromSeed" component={Screens.ImportFromSeed} />
			<Stack.Screen name="ImportWithKeplr" component={Screens.ImportWithKeplr} />
			<Stack.Screen name="SettingsSecurity" component={Screens.SettingsSecurity} />
			<Stack.Screen name="SettingsNotifications" component={Screens.SettingsNotifications} />
			<Stack.Screen name="Profile" component={Screens.Profile} />
			<Stack.Screen name="Root" component={BottomTabNavigator} />
			<Stack.Screen name="Loader" component={Screens.Loader} />

			<Stack.Group screenOptions={{ presentation: "modal" }}>
				<Stack.Screen name="ScannerQR" component={Screens.ScannerQR} />
			</Stack.Group>
		</Stack.Navigator>
	</BottomSheetModalProvider>
)
