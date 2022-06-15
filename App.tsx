import "./shim"

import { StatusBar } from "expo-status-bar"
import { Alert, StyleSheet, Text, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { configure } from "mobx"
import useCachedResources from "./hooks/useCachedResources"
import useColorScheme from "./hooks/useColorScheme"
import Navigation from "./navigation"
import { test } from "core/Test"
import { useEffect } from "react"
import { COLOR } from "utils";
import * as NavigationBar from "expo-navigation-bar";
import firebase from '@react-native-firebase/app'
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import FullscreenOverlay from "components/atoms/FullscreenOverlay"
import { Loader } from "components/atoms"
import { useStore } from "hooks"

configure({ useProxies: "ifavailable" });

const requestUserPermission = async () => {
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus) {
    console.log('Permission status:', authorizationStatus);
  }

  return authorizationStatus
}

const requestToken = async () => {
  try {
    const authorizationStatus = await requestUserPermission()

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      const token = await messaging().getToken({
        senderId: firebase.app().options.messagingSenderId
      })

      console.log(token)
      //Alert.alert('A new FCM message arrived!', JSON.stringify(token));
    } else {
      console.error('Push notification, authorization denied')
    }
  } catch (error) {
    console.error(error)
  }
}

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const {settings} = useStore()

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(COLOR.Dark3);
    requestToken()
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
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
            <View style={{display: "flex", justifyContent: "center", alignItems: "center", flex: 1}}>
              <Loader size={60}></Loader>
            </View>
          </FullscreenOverlay>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }
}

const styles = StyleSheet.create({
  gestureHandler: { flex: 1 },
});
