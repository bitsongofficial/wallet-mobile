import { useCallback } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { observer } from "mobx-react-lite";
import { RootStackParamList } from "types";
import { useStore } from "hooks";
import { COLOR } from "utils";
import { Icon2, Switch, ThemedGradient } from "components/atoms";
import { ListButton, Value } from "./components/atoms";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "SettingsNotifications"
>;

export default observer<Props>(function SettingsNotifications({ navigation }) {
  const { settings } = useStore();

  const goBack = useCallback(() => navigation.goBack(), []);

  const toggleEnable = useCallback(
    () => settings.setNotifications({ enable: !settings.notifications.enable }),
    []
  );

  return (
    <>
      <StatusBar style="light" />

      <ThemedGradient style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.wrapper}>
            <Header onPressBack={goBack} style={styles.header} />
            <ScrollView>
              <View style={styles.section}>
                <ListButton
                  icon="bell"
                  text="Enable Notifications"
                  onPress={toggleEnable}
                  Right={
                    <Switch
                      active={settings.notifications.enable}
                      onPress={toggleEnable}
                    />
                  }
                />
                <ListButton
                  icon="clock_counter"
                  text="View History"
                  Right={<Value text={settings.notifications.history} />}
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
