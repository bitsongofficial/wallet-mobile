import "./shim"

import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { configure } from "mobx";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { test } from "core/Test";

configure({ useProxies: "ifavailable" });

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  test()

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <GestureHandlerRootView style={styles.gestureHandler}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }
}

const styles = StyleSheet.create({
  gestureHandler: { flex: 1 },
});
