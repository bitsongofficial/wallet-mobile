import { useCallback, useState } from "react";
import { FlatList, ListRenderItem, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Coin } from "classes";
import { Icon } from "components/atoms";
import { CoinStat, Tabs, ToolbarAction } from "components/organisms";
import useStore from "hooks/useStore";
import { SafeAreaView } from "react-native-safe-area-context";

type ValueTabs = "Coins" | "Fan Tokens";

const tabs: ValueTabs[] = ["Coins", "Fan Tokens"];

export default function MainScreen() {
  const { wallet } = useStore();
  // need culc by wallet
  const balance = "13,700.98";
  const variation = "+ 7.46";
  const reward = "107.23";

  const [activeTab, setActiveTab] = useState<ValueTabs>("Coins");

  const claim = useCallback(() => {}, []);

  const handlePressSend = useCallback(() => {}, []);
  const handlePressReceive = useCallback(() => {}, []);
  const handlePressInquire = useCallback(() => {}, []);
  const handlePressScan = useCallback(() => {}, []);
  const handlePressAll = useCallback(() => {}, []);

  const renderCoins = useCallback<ListRenderItem<Coin>>(
    ({ item }) => <CoinStat coin={item} style={{ marginBottom: 9 }} />,
    []
  );

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        {/* <Icon name="arrow_down" size={40} /> */}
        <View style={styles.header} />

        <View style={styles.info}>
          <View style={styles.balance}>
            <Text style={styles.balance_title}>Total Balance</Text>
            <Text style={styles.balance_value}>{balance} $</Text>
            <Text style={styles.balance_variation}>
              Variation {variation} %
            </Text>
          </View>

          <View style={styles.reward}>
            <Text style={styles.reward_title}>Reward</Text>
            <View style={styles.reward_row}>
              <Text style={styles.reward_value}>{reward} $</Text>
              {/* <Button onPress={claim}>CLAIM</Button> */}
            </View>
          </View>
        </View>

        <View style={styles.toolbar}>
          <ToolbarAction
            title="Send"
            onPress={handlePressSend}
            mode="gradient"
            Icon={<Icon name="arrow_up" />}
          />
          <ToolbarAction
            title="Receive"
            onPress={handlePressReceive}
            Icon={<Icon name="arrow_down" />}
          />
          <ToolbarAction
            title="Inquire"
            onPress={handlePressInquire}
            Icon={<Icon name="tip" />}
          />
          <ToolbarAction
            title="Scan"
            onPress={handlePressScan}
            Icon={<Icon name="qr_code" />}
          />
          <ToolbarAction
            title="All"
            onPress={handlePressAll}
            mode="gradient"
            Icon={<Icon name="meatballs" />}
            iconContainerStyle={{ backgroundColor: "#14142e" }}
          />
        </View>

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
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#14142e",
  },
  header: {
    paddingHorizontal: 45,
    paddingVertical: 16,
    flexDirection: "row",
    height: 70,
    justifyContent: "center",
  },

  info: {
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

  reward_row: {},

  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 24,
    marginBottom: 40,
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
