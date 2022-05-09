import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "navigation/BottomTab";
import * as Screens from "screens";
import { RootStackParamList } from "types";

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

export default () => (
  <Stack.Navigator>
    {/* not auth */}
    <Stack.Screen
      name="Start"
      component={Screens.Start}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CreateSeed"
      component={Screens.CreateSeed}
      options={{ headerShown: false }}
    />

    {/* auth */}
    <Stack.Screen
      name="Root"
      component={BottomTabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ScannerQR"
      component={Screens.ScannerQR}
      options={{ headerShown: false }}
    />
    {/* <Stack.Screen
        name="AccountHome"
        component={Screens.AccountHome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateWallet"
        component={Screens.CreateWallet}
        options={{ title: 'Create New Mnemonic' }}
      />
      <Stack.Screen
        name="ImportWallet"
        component={Screens.ImportWallet}
        options={{ title: 'Import Existing Wallet' }}
      />
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={Screens.NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={Screens.ModalScreen} />
      </Stack.Group> */}
  </Stack.Navigator>
);
