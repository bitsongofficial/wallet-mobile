import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { observer } from "mobx-react-lite";
import { RootStackParamList } from "types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useStore, useTheme } from "hooks";
import { Button, Switch, ThemedGradient } from "components/atoms";
import { COLOR, InputHandler } from "utils";
import { animated, useSpring } from "@react-spring/native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  Agreement,
  Header,
  ListButton,
  Subtitle,
  Title,
  Value,
  WalletButton,
} from "./components/atoms";
import { Head } from "./components/moleculs";
import {
  AddAccount,
  AddWatchAccount,
  ChangeAvatar,
  ChangeCurrency,
  ChangeLanguage,
  ChangeWallet,
} from "./components/organisms";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

type ModalType =
  | "ChangeWallet"
  | "ChangeLanguage"
  | "ChangeCurrency"
  | "AddAccount"
  | "ChangeAvatar"
  | "AddWatchAccount";

export default observer<Props>(function MainScreen({ navigation }) {
  const { settings, user, dapp, wallet } = useStore();

  // ------- BottomSheet ----------

  const currentPosition = useSharedValue(0);
  const animStyle = useAnimatedStyle(() => {
    const opacity = interpolate(currentPosition.value, [0, 350], [0, 0.5]);
    return {
      flex: 1,
      opacity,
    };
  });

  const inputNick = useMemo(() => new InputHandler(user?.nick), [user]);
  const hidden = useSpring({ opacity: inputNick.isFocused ? 0.3 : 1 });

  /// ---------------
  const theme = useTheme();

  const goBack = useCallback(() => navigation.goBack(), []);

  const navToPrivacy = useCallback(() => {}, []);
  const navToTerms = useCallback(() => {}, []);
  const disconnectAndRemove = useCallback(() => {}, []);

  const openAddWatchaccount = useCallback(() => {}, []);
  const openSecurity = useCallback(
    () => navigation.push("SettingsSecurity"),
    []
  );
  const openAddressBook = useCallback(() => navigation.push("AddressBook"), []);
  const openNotifications = useCallback(
    () => navigation.push("SettingsNotifications"),
    []
  );
  const openWalletConnect = useCallback(
    () => navigation.push("WalletConnect"),
    []
  );

  const toggleNightMode = useCallback(() => {}, []);
  const openCurrencyApp = useCallback(() => {}, []);
  const openFAQ = useCallback(() => {}, []);
  const openTermsAndConditions = useCallback(() => {}, []);
  const openPrivacyPolicy = useCallback(() => {}, []);

  const toggleNotification = useCallback(
    () => settings.setNotifications({ enable: !settings.notifications.enable }),
    []
  );

  // --------- Bottom Sheets ------------

  const [modal, setModal] = useState<ModalType | null>(null);
  const closeModal = useCallback(
    (type: ModalType | null) =>
      setModal((value) => (value !== type && type !== null ? value : null)),
    []
  );
  const openChangeWallet = useCallback(() => setModal("ChangeWallet"), []);
  const openChangeLanguage = useCallback(() => setModal("ChangeLanguage"), []);
  const openChangeCurrency = useCallback(() => setModal("ChangeCurrency"), []);
  const openAddAccount = useCallback(() => setModal("AddAccount"), []);
  const openAddWatchAccount = useCallback(
    () => setModal("AddWatchAccount"),
    []
  );
  const openChangeAvatar = useCallback(() => setModal("ChangeAvatar"), []);

  useEffect(() => {
    if (inputNick.isFocused) {
      closeModal(null);
    }
  }, [inputNick.isFocused]);

  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      translationY.value = e.contentOffset.y;
    },
  });
  const headerContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            translationY.value,
            [0, 64],
            [0, -64],
            Extrapolation.CLAMP
          ),
        },
      ],
      position: "absolute",
      zIndex: 1000,
      top: 70,
      width: "100%",
      // backgroundColor: "red",
    };
  });

  return (
    <>
      <StatusBar style="inverted" />

      <ThemedGradient style={styles.container} invert>
        <SafeAreaView style={styles.container}>
          <Animated.View style={animStyle}>
            <Header
              onPressClose={goBack}
              style={styles.header}
              animtedValue={translationY}
            />
            <Animated.View style={headerContainerAnimatedStyle}>
              <Head
                style={styles.head}
                input={inputNick}
                onPressAvatar={openChangeAvatar}
                avatar={user?.photo}
                animtedValue={translationY}
              />
            </Animated.View>
            <Animated.ScrollView
              onScroll={scrollHandler}
              contentContainerStyle={{ paddingTop: 100 }}
              scrollEventThrottle={1}
            >
              <animated.View style={[styles.wrapper, hidden]}>
                <Subtitle style={styles.subtitle}>Connected with</Subtitle>
                <WalletButton
                  onPress={openChangeWallet}
                  wallet={wallet}
                  style={{ marginBottom: 16 }}
                />

                <ListButton
                  text="Add a new account"
                  onPress={openAddAccount}
                  icon="wallet"
                  arrow
                  style={styles.listButton}
                />
                <ListButton
                  text="Add a Watch account"
                  onPress={openAddWatchAccount}
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
                      <Switch
                        active={settings.notifications.enable}
                        onPress={toggleNotification}
                      />
                    }
                  />
                  <ListButton
                    text="Wallet Connect"
                    icon="wallet_connect"
                    onPress={openWalletConnect}
                    style={styles.listButton}
                    arrow
                  />
                </View>

                <View style={styles.section}>
                  <Subtitle style={styles.subtitle}>App Preferences</Subtitle>
                  <ListButton
                    text="Language"
                    onPress={openChangeLanguage}
                    icon="translate"
                    style={styles.listButton}
                    Right={<Value text={settings.language.name} />}
                  />
                  <ListButton
                    text="Currency"
                    onPress={openChangeCurrency}
                    icon="circle_dollar"
                    style={styles.listButton}
                    Right={
                      settings.currency && (
                        <Value text={settings.currency?.name} />
                      )
                    }
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
                    style={styles.listButton}
                    arrow
                  />
                </View>

                <Button
                  mode="fill"
                  text="Disconnect and Remove Wallet"
                  onPress={disconnectAndRemove}
                  style={styles.button}
                  textStyle={styles.buttonText}
                  contentContainerStyle={styles.buttonContent}
                />
              </animated.View>
            </Animated.ScrollView>
          </Animated.View>
        </SafeAreaView>
      </ThemedGradient>

      {/* --------- Bottom Sheets -----------  */}
      <ChangeAvatar
        isOpen={modal === "ChangeAvatar"}
        backgroundStyle={styles.bottomSheetBackground}
        animatedPosition={currentPosition}
        onClose={() => closeModal("ChangeAvatar")}
      />

      <AddAccount
        isOpen={modal === "AddAccount"}
        backgroundStyle={styles.bottomSheetBackground}
        animatedPosition={currentPosition}
        onClose={() => closeModal("AddAccount")}
      />

      <AddWatchAccount
        isOpen={modal === "AddWatchAccount"}
        backgroundStyle={styles.bottomSheetBackground}
        animatedPosition={currentPosition}
        onClose={() => closeModal("AddWatchAccount")}
      />

      <ChangeWallet
        isOpen={modal === "ChangeWallet"}
        backgroundStyle={styles.bottomSheetBackground}
        animatedPosition={currentPosition}
        onClose={() => closeModal("ChangeWallet")}
      />
      <ChangeLanguage
        isOpen={modal === "ChangeLanguage"}
        backgroundStyle={styles.bottomSheetBackground}
        animatedPosition={currentPosition}
        onClose={() => closeModal("ChangeLanguage")}
      />
      <ChangeCurrency
        isOpen={modal === "ChangeCurrency"}
        backgroundStyle={styles.bottomSheetBackground}
        animatedPosition={currentPosition}
        onClose={() => closeModal("ChangeCurrency")}
      />
    </>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    marginLeft: 27.5,
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

  button: { backgroundColor: COLOR.Dark3, marginBottom: 8 },
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
