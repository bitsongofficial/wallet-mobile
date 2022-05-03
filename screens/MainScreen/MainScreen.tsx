import { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Coin } from "classes";
import { Button } from "components/atoms";
import { CoinStat, Tabs } from "components/organisms";
import { useStore } from "hooks";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { observer } from "mobx-react-lite";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { ToolbarFull, ToolbarShort } from "./components";
import { BottomSheetModal } from "components/moleculs";
import SendCoinStack from "navigation/SendCoinStack";

type ValueTabs = "Coins" | "Fan Tokens";

const tabs: ValueTabs[] = ["Coins", "Fan Tokens"];

export default observer(function MainScreen() {
  const { wallet } = useStore();
  // need culc by wallet
  const variation = "+ 7.46";
  const reward = "107.23";

  const [activeTab, setActiveTab] = useState<ValueTabs>("Coins");

  const callback = useCallback(() => {}, []);

  const renderCoins = useCallback<ListRenderItem<Coin>>(
    ({ item }) => (
      <TouchableOpacity onPress={item.increment}>
        <CoinStat coin={item} style={{ marginBottom: 9 }} />
      </TouchableOpacity>
    ),
    []
  );

  // ------------- bottom sheet -----------
  // ref
  const bottomSheetToolbar = useRef<BottomSheetModalMethods>(null);
  const bottomSheetSEND = useRef<BottomSheetModalMethods>(null);

  const snapPoints = useMemo(() => ["70%"], []);

  const openToolbar = useCallback(
    () => bottomSheetToolbar.current?.present(),
    []
  );
  const openSend = useCallback(() => bottomSheetSEND.current?.present(), []);
  const closeSend = useCallback(() => bottomSheetSEND.current?.close(), []);

  const safeAreaInsets = useSafeAreaInsets();
  const sendCoinContainerStyle = useMemo(
    () => ({ paddingBottom: safeAreaInsets.bottom }),
    [safeAreaInsets.bottom]
  );

  return (
    <>
      <StatusBar style="light" />

      <SafeAreaView style={styles.container}>
        <View style={styles.info}>
          <View style={styles.balance}>
            <Text style={styles.balance_title}>Total Balance</Text>
            <Text style={styles.balance_value}>
              {wallet.totalBalance.toLocaleString("en")} $
            </Text>
            <Text style={styles.balance_variation}>
              Variation {variation} %
            </Text>
          </View>

          <View style={styles.reward}>
            <Text style={styles.reward_title}>Reward</Text>
            <View style={styles.reward_row}>
              <Text style={styles.reward_value}>{reward} $</Text>
              <Button onPress={callback}>CLAIM</Button>
            </View>
          </View>
        </View>

        <ToolbarShort
          style={styles.toolbar_short}
          onPressAll={openToolbar}
          onPressInquire={callback}
          onPressReceive={callback}
          onPressScan={callback}
          onPressSend={openSend}
        />

        <Tabs
          values={tabs}
          active={activeTab}
          // @ts-ignore TODO: create cool types
          onPress={setActiveTab}
          style={styles.tabs}
        />

        <View style={styles.coins}>
          <FlatList
            style={styles.coins_list}
            keyExtractor={({ info }) => info._id}
            data={wallet.coins}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={renderCoins}
          />
        </View>

        <BottomSheetModal
          ref={bottomSheetToolbar}
          index={0}
          snapPoints={snapPoints}
        >
          <ToolbarFull
            style={styles.toolbar_full}
            onPressSend={openSend}
            onPressReceive={callback}
            onPressInquire={callback}
            onPressScan={callback}
            onPressClaim={callback}
            onPressStake={callback}
            onPressUnstake={callback}
            onPressRestake={callback}
            onPressIssue={callback}
            onPressMint={callback}
            onPressBurn={callback}
          />
        </BottomSheetModal>

        <BottomSheetModal
          ref={bottomSheetSEND}
          $modal
          index={0}
          snapPoints={["85%"]}
        >
          <SendCoinStack style={sendCoinContainerStyle} onSend={closeSend} />
        </BottomSheetModal>
      </SafeAreaView>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#14142e",
  },
  info: {
    marginTop: 80,
    marginRight: 22,
    marginLeft: 32,
    marginBottom: 60,
  },
  balance: {
    marginBottom: 34,
  },
  balance_title: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 18,
    lineHeight: 23,
    color: "#575BDB",

    marginBottom: 10,
  },
  balance_value: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 42,
    lineHeight: 53,
    color: "#FFFFFF",

    marginBottom: 6,
  },
  balance_variation: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
    color: "#FFFFFF",
    opacity: 0.5,
  },

  reward: {},
  reward_title: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 20,
    color: "#575BDB",
    marginBottom: 10,
  },
  reward_value: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 30,
    color: "#FFFFFF",
  },

  reward_row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  toolbar_short: {
    marginHorizontal: 24,
    marginBottom: 40,
  },
  toolbar_full: {
    padding: 24,
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },

  tabs: {
    paddingHorizontal: 30,
    marginBottom: 18,
  },
  coins: {
    flex: 1,
  },
  coins_list: {
    marginHorizontal: 14,
  },
});
