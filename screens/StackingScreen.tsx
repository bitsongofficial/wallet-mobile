import { useCallback, useState } from "react";
import { FlatList, ListRenderItem, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Coin } from "classes";
import { useStore } from "hooks";
import { COLOR } from "utils";
import { Icon } from "components/atoms";
import { CoinStat, Tabs, ToolbarAction } from "components/organisms";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

type ValueTabs = "Staked" | "Validators";

const tabs: ValueTabs[] = ["Staked", "Validators"];

export default function StakingScreen() {
  const { coin } = useStore();
  // need culc by wallet
  const staking = "10,128.88";

  const [activeTab, setActiveTab] = useState<ValueTabs>("Staked");

  const handlePressClaim = useCallback(() => {}, []);
  const handlePressStake = useCallback(() => {}, []);
  const handlePressUnstake = useCallback(() => {}, []);
  const handlePressRestake = useCallback(() => {}, []);

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.info}>
            <Text style={styles.balance_title}>My Staking</Text>
            <Text style={styles.balance_value}>{staking} $</Text>
          </View>

          <View style={styles.toolbar}>
            <ToolbarAction
              title="Claim"
              onPress={handlePressClaim}
              mode="gradient"
              Icon={<Icon name="arrow_up_border" size={23} />}
              size={65}
            />
            <ToolbarAction
              title="Stake"
              onPress={handlePressStake}
              Icon={<Icon name="stake" size={23} />}
              size={65}
            />
            <ToolbarAction
              title="Unstake"
              onPress={handlePressUnstake}
              Icon={<Icon name="unstake" size={23} />}
              size={65}
            />
            <ToolbarAction
              title="Restake"
              onPress={handlePressRestake}
              Icon={<Icon name="unstake" size={23} />}
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
            {coin.coins.map((coin) => (
              <CoinStat
                coin={coin}
                key={coin.info._id}
                style={{ marginBottom: 9 }}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.Dark3,
  },
  info: {
    marginTop: 80,
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
    color: COLOR.White,

    marginBottom: 6,
  },
  balance_variation: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
    color: COLOR.White,
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
    paddingTop: 8,
    paddingBottom: 64,
    marginHorizontal: 14,
  },

  tabs: {
    paddingHorizontal: 30,
    marginBottom: 18,
  },
});
