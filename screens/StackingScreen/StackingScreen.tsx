import { useCallback, useState } from "react";
import { FlatList, ListRenderItem, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Coin } from "classes";
import { Icon } from "components/atoms";
import { CoinStat, Tabs, ToolbarAction } from "components/organisms";
import useStore from "hooks/useStore";
import { SafeAreaView } from "react-native-safe-area-context";

type ValueTabs = "Staked" | "Validators";

const tabs: ValueTabs[] = ["Staked", "Validators"];

export default function StakingScreen() {
  const { wallet } = useStore();
  // need culc by wallet
  const staking = "10,128.88";

  const [activeTab, setActiveTab] = useState<ValueTabs>("Staked");

  const handlePressClaim = useCallback(() => {}, []);
  const handlePressStake = useCallback(() => {}, []);
  const handlePressUnstake = useCallback(() => {}, []);
  const handlePressRestake = useCallback(() => {}, []);

  const renderCoins = useCallback<ListRenderItem<Coin>>(
    ({ item }) => <CoinStat coin={item} style={{ marginBottom: 9 }} />,
    []
  );

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header} />

        <View style={styles.info}>
          <Text style={styles.balance_title}>My Staking</Text>
          <Text style={styles.balance_value}>{staking} $</Text>
        </View>

        <View style={styles.toolbar}>
          <ToolbarAction
            title="Claim"
            onPress={handlePressClaim}
            mode="gradient"
            Icon={<Icon name="arrow_up_border" />}
            size={65}
          />
          <ToolbarAction
            title="Stake"
            onPress={handlePressStake}
            Icon={<Icon name="stake" />}
            size={65}
          />
          <ToolbarAction
            title="Unstake"
            onPress={handlePressUnstake}
            Icon={<Icon name="unstake" />}
            size={65}
          />
          <ToolbarAction
            title="Restake"
            onPress={handlePressRestake}
            Icon={<Icon name="unstake" />}
            size={65}
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
            contentContainerStyle={{ paddingVertical: 8 }}
            data={wallet.coins}
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

  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 24,
    marginBottom: 44,
  },

  coins: {
    flex: 1,
  },

  coins_list: {
    marginHorizontal: 14,
  },

  tabs: {
    paddingHorizontal: 30,
    marginBottom: 18,
  },
});
