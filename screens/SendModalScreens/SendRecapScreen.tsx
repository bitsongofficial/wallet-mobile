import { useCallback, useEffect, useMemo } from "react";
import {
  BackHandler,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { observer } from "mobx-react-lite";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useStore } from "hooks";
import { RootStackParamList } from "types";
import { SendController } from "./classes";
import {
  SendRecap,
} from "./components/templates";
import TransactionCreater from "classes/Transaction/Creater";
import { COLOR, InputHandler } from "utils";
import { Recap } from "./components/organisms";
import { useKeyboard } from "@react-native-community/hooks";
import { Footer } from "./components/atoms";
import { RouteProp } from "@react-navigation/native";

type Props = NativeStackScreenProps<RootStackParamList, "SendRecap">;

export default observer<Props>(function SendRecapScreen({
  navigation,
  route
}) {
  const store = useStore();
  const controller = useMemo(
    () => new SendController(store.coin.coins[0], route.params.creater),
    [store]
  );
  const { steps } = controller;
  const memo = useMemo(() => new InputHandler(), []);
  const keyboard = useKeyboard();

  const goBack = useCallback(
    () => (navigation.goBack()),
    [steps]
  );
  const send = () => {
    route.params.accept()
    goBack()
  };

  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      route.params.reject()
      return true;
    });
    return () => handler.remove();
  }, [goBack]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.spacer}>
        <Recap
          bottomSheet={false}
          style={{ marginTop: 100 }}
          creater={controller.creater}
          onPress={() => {}}
          memoInput={memo}
        />
      </View>
      {!keyboard.keyboardShown && (
        <Footer
          isShowBack={false}
          onPressBack={goBack}
          onPressCenter={send}
          centerTitle="Confirm"
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  wrapper: {
    flex: 1,
    backgroundColor: COLOR.Dark1,
  },
  header: { marginTop: 10 },
  spacer: {
    marginHorizontal: 30,
    flex: 1,
    justifyContent: "flex-end",
  }
});
