import { useCallback, useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { observer } from "mobx-react-lite";
import { RootStackParamList } from "types";
import { useStore } from "hooks";
import { Icon2, ThemedGradient } from "components/atoms";
// import { Header } from "./components/atoms";
import { COLOR, InputHandler } from "utils";
import { ListButton, Subtitle } from "./components/atoms";

type Props = NativeStackScreenProps<RootStackParamList, "SettingsSecurity">;

export default observer<Props>(function SettingsSecurityScreen({ navigation }) {
  const { settings, user, dapp } = useStore();

  const goBack = useCallback(() => navigation.goBack(), []);

  const toggleEnablePIN = useCallback(() => {}, []);
  const goToChangePin = useCallback(() => {}, []);

  return (
    <>
      <StatusBar style="light" />

      <ThemedGradient style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.wrapper}>
            <Header onPressBack={goBack} style={styles.header} />
            <ScrollView>
              <View style={styles.section}>
                <Subtitle style={styles.subtitle}>PIN settings</Subtitle>
                <ListButton
                  icon="wallet"
                  text="Enable PIN code"
                  onPress={toggleEnablePIN}
                />
                <ListButton
                  icon="wallet"
                  text="Change PIN"
                  onPress={toggleEnablePIN}
                  arrow
                />
              </View>

              <View style={styles.section}>
                <Subtitle style={styles.subtitle}>Account</Subtitle>
                <ListButton
                  icon="wallet"
                  text="View Mnemonics"
                  onPress={toggleEnablePIN}
                  arrow
                />
              </View>

              <View style={styles.section}>
                <Subtitle style={styles.subtitle}>Account</Subtitle>
                <ListButton
                  icon="wallet"
                  text="Enable Biometrics"
                  onPress={toggleEnablePIN}
                />
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </ThemedGradient>
    </>
  );
});

type PropsHeader = {
  onPressBack(): void;
  style?: StyleProp<ViewStyle>;
};

const Header = ({ onPressBack, style }: PropsHeader) => (
  <View style={style}>
    <TouchableOpacity
      onPress={onPressBack}
      style={{
        padding: 5,
        borderRadius: 20,
      }}
    >
      <Icon2 name="arrow_left" size={24} stroke={COLOR.White} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    marginBottom: 25,
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
});
