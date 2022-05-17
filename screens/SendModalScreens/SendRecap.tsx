import { StyleSheet, Text, View } from "react-native";
import { useCallback, useContext, useState } from "react";
import { useTheme } from "hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SendCoinStackParamList } from "navigation/SendCoinStack/types";
import { SendCoinContext } from "navigation/SendCoinStack/context";
import { Tabs } from "components/organisms";
import { Button, ButtonBack } from "components/atoms";
import { users } from "./mock";
import { Advanced, CardData, CardMessages } from "./components/organisms";
// import { CardDetails } from "./components";

type ValueTabs = "Recap" | "Details" | "Data";
const tabs = ["Recap", "Details", "Data"];

type Props = NativeStackScreenProps<SendCoinStackParamList, "SelectReceiver">;

export default function SelectReceiver({ navigation }: Props) {
  const theme = useTheme();
  const { coin, onSend, address, amount } = useContext(SendCoinContext);

  const receiver = users[0];

  const [activeTab, setActiveTab] = useState<ValueTabs>("Details");

  const done = useCallback(() => onSend(), [onSend]);
  const goBack = useCallback(() => navigation.goBack(), []);

  const [gas, setGas] = useState("");
  const [memo, setMemo] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.wrapper33}>
        <Text style={[styles.title, theme.text.primary]}>Send Recap</Text>

        <Tabs
          values={tabs}
          active={activeTab}
          // @ts-ignore TODO: create cool types
          onPress={setActiveTab}
          style={styles.tabs}
        />
      </View>

      <View style={{ marginHorizontal: 24 }}>
        {activeTab === "Recap" && (
          <>
            {coin && receiver && (
              <CardDetails
                coin={coin}
                amount={amount}
                address={address}
                receiver={receiver}
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
            <Advanced
              gas={gas}
              memo={memo}
              onChangeGas={setGas}
              onChangeMemo={setMemo}
            />
          </>
        )}
        {activeTab === "Data" && (
          <CardData json={JSON.stringify(require("../../app.json"), null, 4)} />
        )}
      </View>

      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View style={styles.buttonContainer}>
          <ButtonBack onPress={goBack} style={styles.buttonBack} />
          <Button
            contentContainerStyle={styles.buttonContent}
            textStyle={styles.buttonText}
            onPress={done}
          >
            Send
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  wrapper33: { marginHorizontal: 33 },
  wrapper12: { marginHorizontal: 12 },
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

  // ------ button ------ TODO: Make common component
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  buttonContent: {
    paddingVertical: 18,
    paddingHorizontal: 56,
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 19,
  },

  // -----
  buttonBack: {
    position: "absolute",
    bottom: 18,
    left: 33,
  },
});
