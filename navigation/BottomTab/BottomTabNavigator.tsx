import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "types";
import * as Screens from "screens";
import { Icon2 } from "components/atoms";
import { Header, MainTabBar } from "./components";
import { COLOR, hexAlpha } from "utils";

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function getStroke(focused: boolean) {
  return focused ? COLOR.White : hexAlpha(COLOR.White, 50);
}

export default () => (
  <BottomTab.Navigator
    initialRouteName="MainTab"
    tabBar={(props) => <MainTabBar {...props} />}
    screenOptions={{
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      tabBarStyle: { position: "absolute" },
      tabBarShowLabel: false,
      tabBarActiveTintColor: "red",
    }}
  >
    <BottomTab.Screen
      name="MainTab"
      component={Screens.Main}
      options={() => ({
        tabBarIcon: ({ focused }) => (
          <Icon2 name="home" size={20} stroke={getStroke(focused)} />
        ),
      })}
    />
    <BottomTab.Screen
      name="StackingTab"
      component={Screens.Stacking}
      options={{
        tabBarIcon: ({ focused }) => (
          <Icon2 name="stake" size={20} stroke={getStroke(focused)} />
        ),
      }}
    />
    <BottomTab.Screen
      name="Tab1"
      component={Screens.TabOneScreen}
      options={() => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Icon2 name="like" size={20} stroke={getStroke(focused)} />
        ),
      })}
    />
    <BottomTab.Screen
      name="Tab2"
      component={Screens.TabTwoScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Icon2 name="circle" size={20} stroke={getStroke(focused)} />
        ),
      }}
    />
  </BottomTab.Navigator>
);
