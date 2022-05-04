import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { SendCoinStackParamList } from "./types";
import { SendCoinContext, useSendCoinContextValue } from "./context";
import Header from "./Header";
import * as Screen from "screens/SendModalScreens";

type Props = {
  style?: StyleProp<ViewStyle>;
  onSend(): void;
};

const options: NativeStackNavigationOptions = {
  headerShown: true,
  header: (props) => <Header {...props} />,
  contentStyle: { backgroundColor: "transprent" },
  animation: "none",
};

const Stack = createNativeStackNavigator<SendCoinStackParamList>();

export default observer(function ModalSend({ style, onSend }: Props) {
  const contextValue = useSendCoinContextValue(onSend);
  return (
    <View style={[styles.container, style]}>
      <SendCoinContext.Provider value={contextValue}>
        <NavigationContainer independent>
          <Stack.Navigator screenOptions={options}>
            <Stack.Screen
              name="InsertImport"
              options={{ title: "Insert Import" }}
              component={Screen.InsertImport}
            />
            <Stack.Screen
              name="SelectReceiver"
              options={{ title: "Select Receiver" }}
              component={Screen.SelectReceiver}
            />
            <Stack.Screen
              name="SelectCoin"
              options={{ headerShown: false }}
              component={Screen.SelectCoin}
            />
            <Stack.Screen
              name="SendRecap"
              options={{ headerShown: false }}
              component={Screen.SendRecap}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SendCoinContext.Provider>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flex: 1,
  },
});
