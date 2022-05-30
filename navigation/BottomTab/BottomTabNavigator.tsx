import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "types";
import * as Screens from "screens";
import { Icon } from "components/atoms";
import { Header, MainTabBar } from "./components";
import { hexAlpha } from "utils";

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

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
          <Icon
            name="home"
            fill={focused ? hexAlpha("#FFFFFF", 10) : undefined}
          />
        ),
      })}
    />
    <BottomTab.Screen
      name="StackingTab"
      component={Screens.Stacking}
      options={{
        tabBarIcon: ({ focused }) => (
          <Icon
            name="target"
            fill={focused ? hexAlpha("#FFFFFF", 10) : undefined}
          />
        ),
      }}
    />
    <BottomTab.Screen
      name="Tab1"
      component={Screens.TabOneScreen}
      options={() => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Icon
            name="target"
            fill={focused ? hexAlpha("#FFFFFF", 10) : undefined}
          />
        ),
      })}
    />
    <BottomTab.Screen
      name="Tab2"
      component={Screens.TabTwoScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Icon
            name="stake"
            fill={focused ? hexAlpha("#FFFFFF", 10) : undefined}
          />
        ),
      }}
    />
  </BottomTab.Navigator>
);
