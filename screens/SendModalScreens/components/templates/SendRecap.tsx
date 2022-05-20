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
import { useTheme } from "hooks";
import { InputHandler } from "utils";
import { Tabs } from "components/organisms";
import { users } from "../../mock";
import { SendController } from "../../classes";
import { Footer } from "../atoms";
import { Data, Details, Recap } from "../organisms";

type ValueTabs = "Recap" | "Details" | "Data";
const tabs = ["Recap", "Details", "Data"];

type Props = {
  controller: SendController;
  onPressBack(): void;
  onPressSend(): void;
};

export default observer(function SelectReceiver({
  controller,
  onPressBack,
  onPressSend,
}: Props) {
  const theme = useTheme();
  const receiver = users[0];
  const { creater } = controller;

  const [activeTab, setActiveTab] = useState<ValueTabs>("Details");

  const gas = useMemo(() => new InputHandler(), []);
  const memo = useMemo(() => new InputHandler(), []);
  const speed = useMemo(() => new InputHandler(), []);

  const scrollview = useRef<BottomSheetScrollViewMethods>(null);
  const scrollToNode = useCallback(
    (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      // scrollview.current?.scroll(findNodeHandle(event.target)),
      scrollview.current?.scrollToEnd();
      // console.log("event :>> ", event);
    },
    []
  );
  const keyboard = useKeyboard();
  // console.log("keyboard", keyboard);

  return (
    <View style={styles.container}>
      <Tabs
        values={tabs}
        active={activeTab}
        // @ts-ignore TODO: create cool types
        onPress={setActiveTab}
        style={styles.tabs}
      />
      {activeTab === "Recap" && <Recap creater={creater} onPress={() => {}} />}
      {activeTab === "Details" && (
        <BottomSheetScrollView
          ref={scrollview}
          style={{ marginTop: 6 }}
          contentContainerStyle={{ paddingTop: 30 }}
        >
          <Details gas={gas} memo={memo} speed={speed} onFocus={scrollToNode} />
        </BottomSheetScrollView>
      )}
      {activeTab === "Data" && (
        <Data json={JSON.stringify(require("../../../../app.json"), null, 4)} />
      )}
      {!keyboard.keyboardShown && (
        <Footer
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