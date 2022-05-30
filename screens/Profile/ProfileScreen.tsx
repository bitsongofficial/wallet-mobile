import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { observer } from "mobx-react-lite";
import { RootStackParamList } from "types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useStore, useTheme } from "hooks";
import { Button, Switch, ThemedGradient } from "components/atoms";
import {
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { COLOR, InputHandler } from "utils";
import { animated, useSpring } from "@react-spring/native";
import { BottomSheet } from "components/moleculs";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useDimensions } from "@react-native-community/hooks";
import {
  Agreement,
  Header,
  ListButton,
  Subtitle,
  Title,
} from "./components/atoms";
import { Head } from "./components/moleculs";
import GenerateMnenonic from "./components/moleculs/GenerateMnenonic";
import {
  ChangeCurrency,
  ChangeLanguage,
  ChangeWallet,
} from "./components/organisms";

type ValueTabs = "Coins" | "Fan Tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export default observer<Props>(function MainScreen({ navigation }) {
  const { settings, user, dapp } = useStore();

  // ------- BottomSheet ----------
  const bottomSheet = useRef<BottomSheetMethods>(null);

  const openBSAvatar = useCallback(
    () => bottomSheet.current?.snapToIndex(0),
    []
  );
  const closeBSAvatar = useCallback(() => bottomSheet.current?.close(), []);

  const snapPoints = useMemo(() => [350, "95%"], []);

  const currentPosition = useSharedValue(0);
  const animStyle = useAnimatedStyle(() => ({
    flex: 1,
    opacity: interpolate(currentPosition.value, [0, 350], [0, 0.5]),
  }));

  const inputNick = useMemo(() => new InputHandler(user?.nick), [user]);
  const hidden = useSpring({ opacity: inputNick.isFocused ? 0.3 : 1 });

  useEffect(() => {
    if (inputNick.isFocused) {
      closeBSAvatar();
    }
  }, [inputNick.isFocused]);

  /// ---------------
  const theme = useTheme();

  const goBack = useCallback(() => navigation.goBack(), []);

  const navToPrivacy = useCallback(() => {}, []);
  const navToTerms = useCallback(() => {}, []);
  const disconnectAndRemove = useCallback(() => {}, []);

  const openAddNewaccount = useCallback(() => {}, []);
  const openAddWatchaccount = useCallback(() => {}, []);
  const openSecurity = useCallback(
    () => navigation.push("SettingsSecurity"),
    []
  );
  const openAddressBook = useCallback(() => {}, []);
  const openNotifications = useCallback(() => {
    console.log("openNotifications :>> ");
    navigation.push("SettingsNotifications");
  }, []);
  const openWalletConnect = useCallback(
    () => navigation.push("WalletConnect"),
    []
  );
  const openLanguages = useCallback(() => {}, []);
  const openCurrency = useCallback(() => {}, []);
  const toggleNightMode = useCallback(() => {}, []);
  const openCurrencyApp = useCallback(() => {}, []);
  const openFAQ = useCallback(() => {}, []);
  const openTermsAndConditions = useCallback(() => {}, []);
  const openPrivacyPolicy = useCallback(() => {}, []);

  const [first, setfirst] = useState(false);
  const toggleNotification = useCallback(() => {
    // console.log("press Button :>> ");
    setfirst((value) => {
      // console.log("toggle :>> ", !value);
      return !value;
    });
  }, []);
  // console.log("first", first);

  return (
    <>
      <StatusBar style="light" />

      <ThemedGradient style={styles.container}>
        <SafeAreaView style={styles.container}>
          <Animated.View style={animStyle}>
            <Header onPressClose={goBack} style={styles.header} />
            <ScrollView contentContainerStyle={{ paddingTop: 25 }}>
              <Head
                style={styles.head}
                input={inputNick}
                onPressAvatar={openBSAvatar}
              />
              <animated.View style={[styles.wrapper, hidden]}>
                <Subtitle style={styles.subtitle}>Connected with</Subtitle>
                {/* <Wallet /> */}
                <ListButton
                  text="Add a new account"
                  onPress={openAddNewaccount}
                  icon="wallet"
                  arrow
                  style={styles.listButton}
                />
                <ListButton
                  text="Add a Watch account"
                  onPress={openAddWatchaccount}
                  /* todo change eye.svg */
                  icon="eye"
                  arrow
                />
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
                    text="Security"
                    arrow
                    style={styles.listButton}
                  />
                  <ListButton
                    onPress={openAddressBook}
                    icon="address_book"
                    text="Address Book"
                    arrow
                    style={styles.listButton}
                  />
                  <ListButton
                    text="Notifications"
                    onPress={openNotifications}
                    icon="bell"
                    style={styles.listButton}
                    Right={
                      <Switch active={first} onPress={toggleNotification} />
                    }
                  />
                  <ListButton
                    text="Wallet Connect"
                    onPress={openWalletConnect}
                    arrow
                    style={styles.listButton}
                  />
                </View>

                <View style={styles.section}>
                  <Subtitle style={styles.subtitle}>App Preferences</Subtitle>
                  <ListButton
                    text="Language"
                    onPress={openLanguages}
                    icon="translate"
                    style={styles.listButton}
                  />
                  <ListButton
                    text="Currency"
                    onPress={openCurrency}
                    icon="circle_dollar"
                    style={styles.listButton}
                  />
                  <ListButton
                    text="Night Mode"
                    onPress={toggleNightMode}
                    icon="moon"
                    style={styles.listButton}
                  />
                </View>

                <View style={styles.section}>
                  <Subtitle style={styles.subtitle}>Support</Subtitle>
                  <ListButton
                    text="Currency App"
                    onPress={openCurrencyApp}
                    icon="star"
                    arrow
                    style={styles.listButton}
                  />
                  <ListButton
                    text="FAQ"
                    onPress={openFAQ}
                    icon="chat_dots"
                    arrow
                    style={styles.listButton}
                  />
                  <ListButton
                    text="Terms and conditions"
                    onPress={openTermsAndConditions}
                    icon="file_text"
                    arrow
                    style={styles.listButton}
                  />
                  <ListButton
                    text="Privacy Policy"
                    onPress={openPrivacyPolicy}
                    icon="file_text"
                    arrow
                    style={styles.listButton}
                  />
                </View>

                <Button
                  mode="fill"
                  text="Disconnect and Remove W allet"
                  onPress={disconnectAndRemove}
                  style={styles.button}
                  textStyle={styles.buttonText}
                  contentContainerStyle={styles.buttonContent}
                />
              </animated.View>
            </ScrollView>
          </Animated.View>
        </SafeAreaView>
      </ThemedGradient>

      <BottomSheet
        enablePanDownToClose
        snapPoints={snapPoints}
        ref={bottomSheet}
        backgroundStyle={styles.bottomSheetBackground}
        animatedPosition={currentPosition}
        index={-1}
      >
        <View style={{ marginTop: 15 }}>
          <ChangeWallet />
          <View style={{ marginHorizontal: 26 }}>
            {/* <ChangeCurrency /> */}
            {/* <ChangeLanguage /> */}
            {/* <GenerateMnenonic /> */}
            {/* <AddAccount
            onPressCreate={() => {}}
            onPressImport={() => {}}
            close={closeBSAvatar}
          /> */}
            {/* <ChangeAvatar close={closeBSAvatar} /> */}
          </View>
        </View>
      </BottomSheet>
    </>
  );
});

const Wallet = () => {};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    marginLeft: 26,
    marginRight: 17,
  },

  head: {
    marginHorizontal: 25, // <- wrapper
    marginBottom: 30,
  },

  wrapper: { marginHorizontal: 34 },
  wrapper_opacity: { opacity: 0.1 },
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

  bottomSheetBackground: {
    backgroundColor: COLOR.Dark3,
    paddingTop: 30,
  },
});
