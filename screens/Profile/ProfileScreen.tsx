import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { observer } from "mobx-react-lite";
import { RootStackParamList } from "types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useStore } from "hooks";
import { Button, ThemedGradient } from "components/atoms";
import { Agreement, ListButton, Subtitle, Title } from "./components/atoms";
import { Head } from "./components/moleculs";
import { useSpring } from "@react-spring/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { reaction } from "mobx";
import { ScrollView } from "react-native-gesture-handler";
import { COLOR, InputHandler } from "utils";

type ValueTabs = "Coins" | "Fan Tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export default observer<Props>(function MainScreen({ navigation }) {
  const { settings, user, dapp } = useStore();

  const inputNick = useMemo(() => new InputHandler(user?.nick), [user]);
  const hidden = useSpring({ opacity: inputNick.isFocused ? 0.3 : 1 });

  const goBack = useCallback(() => navigation.goBack(), []);

  const navToPrivacy = useCallback(() => {}, []);
  const navToTerms = useCallback(() => {}, []);
  const disconnectAndRemove = useCallback(() => {}, []);

  const openAddNewaccount = useCallback(() => {}, []);
  const openAddWatchaccount = useCallback(() => {}, []);
  const openSecurity = useCallback(() => {}, []);
  const openAddressBook = useCallback(() => {}, []);
  const openNotifications = useCallback(() => {}, []);
  const openWalletConnect = useCallback(() => {}, []);
  const openLanguages = useCallback(() => {}, []);
  const openCurrency = useCallback(() => {}, []);
  const toggleNightMode = useCallback(() => {}, []);
  const openCurrencyApp = useCallback(() => {}, []);
  const openFAQ = useCallback(() => {}, []);
  const openTermsAndConditions = useCallback(() => {}, []);
  const openPrivacyPolicy = useCallback(() => {}, []);

  return (
    <>
      <StatusBar style="light" />

      <ThemedGradient style={styles.container}>
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <Head style={styles.head} input={inputNick} />
            <animated.View style={[styles.wrapper, hidden]}>
              <Subtitle style={styles.subtitle}>Connected with</Subtitle>
              {/* <Wallet /> */}
              <ListButton
                onPress={openAddNewaccount}
                icon="wallet"
                arrow
                style={styles.listButton}
              >
                Add a new account
              </ListButton>
              {/* todo change eye.svg */}
              <ListButton onPress={openAddWatchaccount} icon="eye" arrow>
                Add a Watch account
              </ListButton>
              <Agreement
                onPressPrivacy={navToPrivacy}
                onPressTerms={navToTerms}
                style={styles.agreement}
              />

              <Title style={styles.title}>Settings</Title>

              <View style={styles.section}>
                <Subtitle style={styles.subtitle}>Account</Subtitle>
                <ListButton
                  onPress={openSecurity}
                  icon="star_shield"
                  arrow
                  style={styles.listButton}
                >
                  Security
                </ListButton>
                <ListButton
                  onPress={openAddressBook}
                  icon="address_book"
                  arrow
                  style={styles.listButton}
                >
                  Address Book
                </ListButton>
                <ListButton
                  onPress={openNotifications}
                  icon="bell"
                  style={styles.listButton}
                >
                  Notifications
                </ListButton>
                <ListButton
                  onPress={openWalletConnect}
                  arrow
                  style={styles.listButton}
                >
                  Wallet Connect
                </ListButton>
              </View>

              <View style={styles.section}>
                <Subtitle style={styles.subtitle}>App Preferences</Subtitle>
                <ListButton
                  onPress={openLanguages}
                  icon="translate"
                  style={styles.listButton}
                >
                  Language
                </ListButton>
                <ListButton
                  onPress={openCurrency}
                  icon="circle_dollar"
                  style={styles.listButton}
                >
                  Currency
                </ListButton>
                <ListButton
                  onPress={toggleNightMode}
                  icon="moon"
                  style={styles.listButton}
                >
                  Night Mode
                </ListButton>
              </View>

              <View style={styles.section}>
                <Subtitle style={styles.subtitle}>Support</Subtitle>
                <ListButton
                  onPress={openCurrencyApp}
                  icon="star"
                  arrow
                  style={styles.listButton}
                >
                  Currency App
                </ListButton>
                <ListButton
                  onPress={openFAQ}
                  icon="chat_dots"
                  arrow
                  style={styles.listButton}
                >
                  FAQ
                </ListButton>
                <ListButton
                  onPress={openTermsAndConditions}
                  icon="file_text"
                  arrow
                  style={styles.listButton}
                >
                  Terms and conditions
                </ListButton>
                <ListButton
                  onPress={openPrivacyPolicy}
                  icon="file_text"
                  arrow
                  style={styles.listButton}
                >
                  Privacy Policy
                </ListButton>
              </View>

              <Button
                mode="fill"
                text="Disconnect and Remove Wallet"
                onPress={disconnectAndRemove}
                style={styles.button}
                textStyle={styles.buttonText}
                contentContainerStyle={styles.buttonContent}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </ThemedGradient>
    </>
  );
});

const Wallet = () => {};
const Switch = () => {
  const isActive = useSpring({
    width: active ? 19 : 8,
    backgroundColor: active ? COLOR.White : "#5A5A6D",
  });
  const {} = useSpring();
  return (
    <View
      style={{
        width: 55,
        height: 28,
        backgroundColor: COLOR.Dark3,
        borderRadius: 20,
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  head: {
    marginHorizontal: 25, // <- wrapper
    marginBottom: 30,
  },

  wrapper: { marginHorizontal: 34 },
  wrapper_opecity: { opacity: 0.1 },
  agreement: { marginBottom: 54, marginTop: 25 },
  title: { marginBottom: 38 },
  section: { marginBottom: 35 },
  subtitle: { marginBottom: 22 },

  listButton: { marginTop: 4 },

  button: { backgroundColor: COLOR.Dark3 },
  buttonContent: { paddingVertical: 18 },
  buttonText: {
    fontSize: 14,
    lineHeight: 18,
  },
});
