import { useCallback } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { useTheme } from "hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import { observer } from "mobx-react-lite";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import { Button } from "components/atoms";
import Icon2 from "components/atoms/Icon2";

type Props = NativeStackScreenProps<RootStackParamList, "Start">;

export default observer<Props>(function StartScreen({ navigation }) {
  const theme = useTheme();
  const { height, width } = useWindowDimensions();

  const createSeedPhrase = useCallback(() => navigation.push("CreateSeed"), []);

  return (
    <>
      <StatusBar style="light" />

      <SafeAreaView style={styles.container}>
        <View style={styles.bottom}>
          <Text style={[styles.text, theme.text.primary]}>
            A nice phrase to {"\n"}welcome our users.
          </Text>

          <View style={styles.buttons}>
            <Button
              onPress={createSeedPhrase}
              contentContainerStyle={styles.buttonContent}
              style={{ marginBottom: 18 }}
            >
              <Text style={[styles.buttonText, theme.text.primary]}>
                Create Wallet
              </Text>
              <Icon2 name="chevron_right" size={18} />
            </Button>
            <Button
              mode="fill"
              contentContainerStyle={styles.buttonContent}
              style={{ marginBottom: 24 }}
            >
              <Text style={[styles.buttonText, theme.text.primary]}>
                Import Existing Wallet
              </Text>
              <Icon2 name="chevron_right" size={18} />
            </Button>
            <Button contentContainerStyle={styles.buttonContent} mode="fill">
              <Text style={[styles.buttonText, theme.text.colorText]}>
                Import with{" "}
                <Text style={[theme.text.primary]}>Ledger Nano X</Text>
              </Text>
              <Icon2 name="chevron_right" size={18} />
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#14142e",
    justifyContent: "flex-end",
  },
  buttons: {
    marginTop: 50,
    marginHorizontal: 24,
    justifyContent: "flex-end",
  },

  bottom: {
    justifyContent: "flex-end",
    flex: 1,
  },

  buttonContent: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  buttonText: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
  },
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 24,
    lineHeight: 30,

    marginHorizontal: 32,
  },
});
