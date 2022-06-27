import "./shim";

import { StatusBar } from "expo-status-bar";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { configure } from "mobx";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { test } from "core/Test";
import { useEffect } from "react";
import { COLOR } from "utils";
import * as NavigationBar from "expo-navigation-bar";
import FullscreenOverlay from "components/atoms/FullscreenOverlay";
import { Loader } from "components/atoms";
import { useStore } from "hooks";
import { setUpPushNotificationsEvents } from "utils/pushNotifications";
import { observer } from "mobx-react-lite";

configure({ useProxies: "ifavailable" });

const App = observer(() => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const { settings } = useStore();

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(COLOR.Dark3);
    }
    setUpPushNotificationsEvents();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <GestureHandlerRootView style={styles.gestureHandler}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
          <FullscreenOverlay showing={settings.showLoadingOverlay}>
            <View style={styles.loaderContainer}>
              <Loader size={60}></Loader>
            </View>
          </FullscreenOverlay>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }
});

const styles = StyleSheet.create({
  gestureHandler: { flex: 1 },
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default App;
