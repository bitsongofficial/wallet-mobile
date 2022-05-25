import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import BottomTabNavigator from "navigation/BottomTab";
import * as Screens from "screens";
import { RootStackParamList } from "types";

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

export default () => (
  <BottomSheetModalProvider>
    <Stack.Navigator>
      {/* not auth */}
      <Stack.Screen
        name="Start"
        component={Screens.Start}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateWallet"
        component={Screens.CreateWallet}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ImportFromSeed"
        component={Screens.ImportFromSeed}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ImportWithKeplr"
        component={Screens.ImportWithKeplr}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={Screens.Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SettingsSecurity"
        component={Screens.SettingsSecurity}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SettingsNotifications"
        component={Screens.SettingsNotifications}
        options={{ headerShown: false }}
      />

      {/* auth */}
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="ScannerQR"
          component={Screens.ScannerQR}
          options={{ headerShown: false }}
        />
      </Stack.Group>
    </Stack.Navigator>
  </BottomSheetModalProvider>
);
