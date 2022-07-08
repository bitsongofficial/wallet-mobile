import "./shim";

import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { configure, toJS } from "mobx";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { useEffect } from "react";
import { COLOR } from "utils";
import * as NavigationBar from "expo-navigation-bar";
import FullscreenOverlay from "components/atoms/FullscreenOverlay";
import { Loader } from "components/atoms";
import { useGlobalBottomsheet, useLoading, useTheme } from "hooks";
import { setUpPushNotificationsEvents } from "utils/pushNotifications";
import { observer } from "mobx-react-lite";
import { BottomSheet } from "components/moleculs";

configure({ useProxies: "ifavailable" });

const App = observer(() => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const loading = useLoading();
  const bottomsheet = useGlobalBottomsheet();

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(COLOR.Dark3);
    }
  }, []);

  const theme = useTheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <GestureHandlerRootView
        style={[styles.gestureHandler, theme.appBackground]}
      >
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />

          <FullscreenOverlay showing={loading.isOpen}>
            <View style={styles.loaderContainer}>
              <Loader size={60} />
            </View>
          </FullscreenOverlay>

          <BottomSheet
            {...toJS(bottomsheet.defaultProps)}
            {...toJS(bottomsheet.props)}
            children={bottomsheet.children}
            ref={bottomsheet.ref}
          />
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
