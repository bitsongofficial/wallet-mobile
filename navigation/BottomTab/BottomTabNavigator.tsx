import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { RootTabParamList } from "types"
import * as Screens from "screens"
import { Icon2 } from "components/atoms"
import { MainTabBar } from "./components"
import { COLOR, hexAlpha } from "utils"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { Header } from "components/organisms"

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>()

function getStroke(focused: boolean) {
	return focused ? COLOR.White : hexAlpha(COLOR.White, 50)
}

export default () => (
	<BottomSheetModalProvider>
		<BottomTab.Navigator
			tabBar={(props) => <MainTabBar {...props} />}
			screenOptions={{
				header: (props) => <Header {...props} />,
				headerStyle: {
					// paddingBottom: 20,
				},
				headerTransparent: true,
				tabBarStyle: { position: "absolute" },
				tabBarShowLabel: false,
				// headerShown: false,
			}}
		>
			<BottomTab.Screen
				name="MainTab"
				component={Screens.Main}
				options={() => ({
					tabBarIcon: ({ focused }) => <Icon2 name="home" size={20} stroke={getStroke(focused)} />,
				})}
			/>
			<BottomTab.Screen
				name="StackingTab"
				component={Screens.Stacking_2}
				options={{
					tabBarIcon: ({ focused }) => <Icon2 name="stake" size={20} stroke={getStroke(focused)} />,
				}}
			/>
			<BottomTab.Screen
				name="Proposal"
				component={Screens.Proposal}
				options={() => ({
					tabBarIcon: ({ focused }) => <Icon2 name="like" size={20} stroke={getStroke(focused)} />,
				})}
			/>
			<BottomTab.Screen
				name="Tab2"
				component={Screens.Main}
				options={{
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<Icon2 name="circle" size={20} stroke={getStroke(focused)} />
					),
				}}
			/>
		</BottomTab.Navigator>
	</BottomSheetModalProvider>
)
