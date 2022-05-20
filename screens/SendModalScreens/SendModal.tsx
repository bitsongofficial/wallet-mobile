import { useCallback, useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useStore } from "hooks";
import { RootStackParamList, RootTabParamList } from "types";
import { Pagination } from "components/moleculs";
import { SendController } from "./classes";
import { Header } from "./components/atoms";
import {
  InsertImport,
  SendRecap,
  SelectReceiver,
  SelectCoin,
} from "./components/templates";

type Props = {
  style?: StyleProp<ViewStyle>;
  close(): void;
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<RootTabParamList, "MainTab">,
    NativeStackNavigationProp<RootStackParamList>
  >;
};

export default observer<Props>(function SendModal({
  style,
  close,
  navigation,
}) {
  const store = useStore();

  const controller = useMemo(
    () => new SendController(store.wallet.coins[0]),
    [store]
  );

  const { steps, creater } = controller;
  console.log("steps.title", steps.title);

  const isShowHeader = steps.title !== "Select coin";

  const title = useMemo(
    () => (steps.title === "Send Recap" ? steps.title : "Send"),
    [steps.title]
  );
  const subtitle = useMemo(
    () => (steps.title !== "Send Recap" ? steps.title : undefined),
    [steps.title]
  );

  const onPressScanner = useCallback(
    () =>
      navigation.push("ScannerQR", {
        onBarCodeScanned: creater.addressInput.set,
      }),
    [navigation, creater]
  );

  return (
    <BottomSheetView style={[styles.container]}>
      <View style={styles.wrapper}>
        {isShowHeader && (
          <Header
            title={title}
            subtitle={subtitle}
            Pagination={<Pagination acitveIndex={steps.active} count={3} />}
            style={styles.header}
          />
        )}

        {steps.title === "Insert Import" && (
          <InsertImport
            controller={controller}
            onPressNext={() => steps.goTo("Select Receiver")}
            onPressBack={close}
            onPressSelectCoin={() => steps.goTo("Select coin")}
          />
        )}
        {steps.title === "Select Receiver" && (
          <SelectReceiver
            controller={controller}
            onPressBack={steps.goBack}
            onPressRecap={() => steps.goTo("Send Recap")}
            onPressScanner={onPressScanner}
          />
        )}
        {steps.title === "Send Recap" && (
          <SendRecap
            controller={controller}
            onPressBack={steps.goBack}
            onPressSend={close}
          />
        )}
        {steps.title === "Select coin" && (
          <SelectCoin controller={controller} onBack={steps.goBack} />
        )}
      </View>
    </BottomSheetView>
  );
});

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  wrapper: {
    marginHorizontal: 30,
    flex: 1,
  },
  header: { marginTop: 10 },
});
