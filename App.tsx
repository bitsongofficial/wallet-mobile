import "./shim";

import { StatusBar } from "expo-status-bar";
import { Alert, Platform, StyleSheet } from "react-native";
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
import firebase from "@react-native-firebase/app";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { useTheme } from "hooks";

configure({ useProxies: "ifavailable" });

const requestUserPermission = async () => {
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus) {
    console.log("Permission status:", authorizationStatus);
  }

  return authorizationStatus;
};

const requestToken = async () => {
  try {
    const authorizationStatus = await requestUserPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      const token = await messaging().getToken({
        senderId: firebase.app().options.messagingSenderId,
      });

      console.log(token);
      Alert.alert("A new FCM message arrived!", JSON.stringify(token));
    } else {
      console.error("Push notification, authorization denied");
    }
  } catch (error) {
    console.error(error);
  }
};

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(COLOR.Dark3);
    }
    requestToken();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
    });

    return unsubscribe;
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
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }
}

const styles = StyleSheet.create({
  gestureHandler: { flex: 1 },
});
