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
	headerStyle: {
		height: 110,
	},
	header: (props: NativeStackHeaderProps) => <Header {...props} />,
}

export default () => (
	<BottomSheetModalProvider>
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			{/* not auth */}
			<Stack.Screen name="Splash" component={Screens.Splash} />
			<Stack.Screen name="Start" component={Screens.Start} />
			<Stack.Screen name="CreateWallet" component={Screens.CreateWallet} />
			<Stack.Screen name="WalletConnect" component={Screens.WalletConnect} />
			<Stack.Screen name="SendRecap" component={Screens.SendRecap} />
			<Stack.Screen name="PinRequest" component={Screens.Pin} />
			{/* auth */}
			<Stack.Screen name="AddressBook" component={Screens.AddressBook} />
			<Stack.Screen name="ImportFromSeed" component={Screens.ImportFromSeed} />
			<Stack.Screen name="ImportWithKeplr" component={Screens.ImportWithKeplr} />
			<Stack.Screen name="SettingsSecurity" component={Screens.SettingsSecurity} />
			<Stack.Screen name="SettingsNotifications" component={Screens.SettingsNotifications} />
			<Stack.Screen name="Profile" component={Screens.Profile} />
			<Stack.Screen name="Root" component={BottomTabNavigator} />
			<Stack.Screen name="Loader" component={Screens.Loader} />

			<Stack.Screen name="Validator" component={Screens.Validator} options={WithHeaderOption} />
			<Stack.Screen name="NewProposal" component={Screens.NewProposal} options={WithHeaderOption} />
			<Stack.Screen
				name="ProposalDetails"
				component={Screens.ProposalDetails}
				options={WithHeaderOption}
			/>
			<Stack.Screen
				name="Notifications"
				component={Screens.Notificatoins}
				options={WithHeaderOption}
			/>

			<Stack.Group screenOptions={{ presentation: "modal" }}>
				<Stack.Screen name="ScannerQR" component={Screens.ScannerQR} />
			</Stack.Group>
		</Stack.Navigator>
	</BottomSheetModalProvider>
)
