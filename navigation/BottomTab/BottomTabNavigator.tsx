import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { RootTabParamList } from "types"
import * as Screens from "screens"
import { Icon2 } from "components/atoms"
import { MainTabBar } from "./components"
import { COLOR, hexAlpha } from "utils"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { Header } from "components/organisms"
import { View } from "react-native"
import MarkerSoon from "./components/MarkerSoon"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createNativeStackNavigator<RootTabParamList>()

function getStroke(focused: boolean) {
	return focused ? COLOR.White : hexAlpha(COLOR.White, 50)
}

export default () => (
	<BottomSheetModalProvider>
		<BottomTab.Navigator
			screenOptions={{
				header: (props) => <Header {...props} />,
				headerTransparent: true,
			}}
		>
			<BottomTab.Screen
				name="MainTab"
				component={Screens.WalletConnect}
			/>
		</BottomTab.Navigator>
	</BottomSheetModalProvider>
)
