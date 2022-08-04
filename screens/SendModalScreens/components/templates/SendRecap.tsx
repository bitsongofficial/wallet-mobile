import { useCallback, useMemo, useRef, useState } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputFocusEventData,
  View,
} from "react-native";
import { observer } from "mobx-react-lite";
import { useKeyboard } from "@react-native-community/hooks";
import {
  BottomSheetScrollView,
  BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet";
import { useStore, useTheme } from "hooks";
import { InputHandler } from "utils";
import { Tabs, Recap } from "components/organisms";
import { SendController } from "../../classes";
import { Footer } from "../atoms";
import { Data } from "../organisms";
import { SupportedCoins } from "constants/Coins";

type ValueTabs = "Details" | "Data";
const tabs = ["Details", "Data"];

type Props = {
  controller: SendController;
  onPressBack(): void;
  onPressSend(): void;
  isShowBack?: boolean;
};

export default observer(function SelectReceiver({
  controller,
  onPressBack,
  onPressSend,
  isShowBack,
}: Props) {
  const {coin} = useStore()
  const theme = useTheme();

  const [activeTab, setActiveTab] = useState<ValueTabs>("Details");

  const gas = useMemo(() => new InputHandler(), []);
  const memo = useMemo(() => new InputHandler(), []);
  const speed = useMemo(() => new InputHandler(), []);

  const scrollview = useRef<BottomSheetScrollViewMethods>(null);
  const scrollToNode = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      scrollview.current?.scrollToEnd();
    },
    []
  );
  const keyboard = useKeyboard();

  return (
    <View style={styles.container}>
      <Tabs
        values={tabs}
        active={activeTab}
        onPress={setActiveTab}
        style={styles.tabs}
      />
      {activeTab === "Details" && (
        <BottomSheetScrollView
          ref={scrollview}
          style={{ marginTop: 6 }}
          contentContainerStyle={{ paddingTop: 30 }}
        >
          <Recap
            bottomSheet
            style={{ marginTop: 36 }}
            address={controller.creater.address}
            amount={coin.fromCoinBalanceToFiat(controller.creater.balance, controller.creater.coin?.info.coin ?? SupportedCoins.BITSONG).toFixed(2)}
            coin={controller.creater.coin?.info}
            onPress={() => {}}
            memoInput={memo}
          />
        </BottomSheetScrollView>
      )}
      {activeTab === "Data" && (
        <Data
          style={{ marginTop: 36 }}
          json={JSON.stringify(require("../../../../app.json"), null, 4)}
        />
      )}

      {!keyboard.keyboardShown && (
        <Footer
          isShowBack={isShowBack}
          onPressBack={onPressBack}
          onPressCenter={onPressSend}
          centerTitle="Send"
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  self: { marginTop: 19 },

  title: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 21,
    lineHeight: 27,
  },
  caption: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 13,
    lineHeight: 16,
  },
  tabs: {
    marginTop: 29,
  },

  funds: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 27,
  },
});
