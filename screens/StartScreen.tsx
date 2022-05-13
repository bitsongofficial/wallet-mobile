import { useCallback, useRef, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import { observer } from "mobx-react-lite";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";
import { Button, Header } from "components/atoms";
import Icon2 from "components/atoms/Icon2";
import { BottomSheetModal } from "components/moleculs";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useFocusEffect } from "@react-navigation/native";
// @ts-ignore
import waves_light from "assets/images/waves_light.png";

type Props = NativeStackScreenProps<RootStackParamList, "Start">;

const points = ["30"];

export default observer<Props>(function StartScreen({ navigation }) {
  const theme = useTheme();

  const [layout, setLayout] = useState<LayoutRectangle>();
  const getLayoutButtons = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => setLayout(layout),
    []
  );

  const bottomSheet = useRef<BottomSheetModalMethods>(null);
  useFocusEffect(useCallback(() => () => bottomSheet.current?.close(), []));

  const openBottomSheet = useCallback(() => bottomSheet.current?.present(), []);

  const createCreateWallet = useCallback(
    () => navigation.push("CreateWallet"),
    []
  );
  const importFromSeed = useCallback(
    () => navigation.push("ImportFromSeed"),
    []
  );
  const importWithKeplr = useCallback(
    () =>
      navigation.push("ScannerQR", {
        onBarCodeScanned: (data) => {
          navigation.push("ImportWithKeplr", { data });
        },
      }),
    []
  );

  return (
    <>
      <StatusBar style="light" />

      <SafeAreaView style={styles.container}>
        <Header
          Center={
            <>
              <Image source={waves_light} style={styles.waves} />
              <Icon2 name="logo" size={56} />
            </>
          }
        />
        <View style={styles.bottom}>
          <Text style={[styles.text, theme.text.primary]}>
            A nice phrase to {"\n"}welcome our users.
          </Text>

          <View style={styles.buttons} onLayout={getLayoutButtons}>
            <Button
              onPress={createCreateWallet}
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
              onPress={openBottomSheet}
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

      <BottomSheetModal ref={bottomSheet} index={0} snapPoints={points}>
        <View style={styles.bottomSheetContainer}>
          <Text style={[styles.bottomSheetTitle, theme.text.primary]}>
            Import Existing Wallet
          </Text>

          <Button
            onPress={importFromSeed}
            contentContainerStyle={styles.buttonContent}
            style={{ marginBottom: 12 }}
          >
            <Text style={[styles.buttonText, theme.text.primary]}>
              Import from Seed Phrase
            </Text>
            <Icon2 name="chevron_right" size={18} />
          </Button>

          <Button
            onPress={importWithKeplr}
            contentContainerStyle={styles.buttonContent}
            style={{ marginBottom: 12 }}
          >
            <Text style={[styles.buttonText, theme.text.primary]}>
              Import with Keplr Extension
            </Text>
            <Icon2 name="chevron_right" size={18} />
          </Button>
        </View>
      </BottomSheetModal>
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

  bottomSheetTitle: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 20,

    marginBottom: 32,
  },
  bottomSheetContainer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },

  waves: {
    width: 1100,
    height: 1100,
    position: "absolute",
    top: -550,
  },
});
