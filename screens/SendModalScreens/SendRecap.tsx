import { Keyboard, StyleSheet, Text, View } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  BottomSheetScrollView,
  BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet";
import { useTheme } from "hooks";
import { InputHandler } from "utils";
import { Tabs } from "components/organisms";
import { users } from "./mock";
import { SendController } from "./classes";
import {
  Advanced,
  CardData,
  CardDetails,
  CardMessages,
} from "./components/organisms";
import { Footer } from "./components/moleculs";

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
  // useEffect(
  //   () =>
  //     reaction(
  //       () => gas.isFocused,
  //       () => scrollview.current?.scrollTo(gas)
  //     ),
  //   []
  // );
  // useEffect(
  //   () =>
  //     reaction(
  //       () => memo.isFocused,
  //       () => scrollview.current?.scrollTo(memo)
  //     ),
  //   []
  // );
  // useEffect(
  //   () =>
  //     reaction(
  //       () => speed.isFocused,
  //       () => scrollview.current?.scrollTo(speed)
  //     ),
  //   []
  // );

  const [isKeyboardOpen, setKeyboardOpen] = useState<boolean>(false);
  const setOpen = () => setKeyboardOpen(true);
  const setHide = () => setKeyboardOpen(false);
  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", setOpen);
    Keyboard.addListener("keyboardWillHide", setHide);
    return () => {
      Keyboard.removeAllListeners("keyboardWillShow");
      Keyboard.removeAllListeners("keyboardWillHide");
    };
  }, []);

  return (
    <View style={styles.container}>
      <Tabs
        values={tabs}
        active={activeTab}
        // @ts-ignore TODO: create cool types
        onPress={setActiveTab}
        style={styles.tabs}
      />
      <BottomSheetScrollView ref={scrollview} style={{ flexGrow: 1 }}>
        {activeTab === "Recap" && (
          <>
            {creater.coin && receiver && (
              <CardDetails
                coin={creater.coin}
                amount={creater.amount}
                address={creater.addressInput.value}
                receiver={creater.receiver}
                onPress={() => {}}
              />
            )}
            <View style={styles.funds}>
              <Text style={[styles.caption, theme.text.primary]}>
                Your funds come from
              </Text>
            </View>
          </>
        )}
        {activeTab === "Details" && (
          <>
            <CardMessages messages={[{}]} style={{ marginBottom: 27 }} />
            <Advanced gas={gas} memo={memo} speed={speed} />
          </>
        )}
        {activeTab === "Data" && (
          <CardData json={JSON.stringify(require("../../app.json"), null, 4)} />
        )}
      </BottomSheetScrollView>
      {!isKeyboardOpen && (
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
    marginBottom: 36,
  },

  funds: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 27,
  },
});
