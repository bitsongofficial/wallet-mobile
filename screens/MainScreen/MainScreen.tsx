import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CoinStat, ToolbarAction } from "./components";
import Mock from "./mock";
import Coin from "./classes/Coin";
import { useCallback } from "react";
import { Button } from "components/atoms";

const wallet = [
  new Coin(Mock.BitSong),
  new Coin(Mock.Juno),
  new Coin(Mock.Osmosis),
];

export default function MainScreen() {
  const balance = "13,700.98";
  const variation = "+ 7.46";
  const reward = "107.23";

  const renderCoins = useCallback<ListRenderItem<Coin>>(
    ({ item }) => <CoinStat coin={item} style={{ marginBottom: 9 }} />,
    []
  );

  const claim = useCallback(() => {}, []);

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

          <Button mode="outlined" text="Test Button" />
          <Button mode="outlined" text="Test Button" />
          <Button mode="text" text="Test Button" />

          <View style={styles.reward}>
            <Text style={styles.reward_title}>Reward</Text>
            <View style={styles.reward_row}>
              <Text style={styles.reward_value}>{reward} $</Text>
              <Button onPress={claim}>CLAIM</Button>
            </View>
          </View>
        </View>

        <View style={styles.coins}>
          <FlatList
            style={styles.coins_list}
            data={wallet}
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
    justifyContent: "center",
    backgroundColor: "red",
  },

  info: {
    marginRight: 22,
    marginLeft: 32,
  },
  balance: {
    marginBottom: 34,
  },
  balance_title: {
    fontFamily: "Circular Std",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 18,
    lineHeight: 23,
    color: "#575BDB",

    marginBottom: 10,
  },
  balance_value: {
    fontFamily: "Circular Std",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 42,
    lineHeight: 53,
    color: "#FFFFFF",

    marginBottom: 6,
  },
  balance_variation: {
    fontFamily: "Circular Std",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
    color: "#FFFFFF",

    opacity: 0.5,
  },

  reward: {},
  reward_title: {
    fontFamily: "Circular Std",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 20,
    color: "#575BDB",
    marginBottom: 10,
  },
  reward_value: {
    fontFamily: "Circular Std",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 30,
    // lineHeight: 27,
    backgroundColor: "green",
    color: "#FFFFFF",
  },

  reward_row: {},

  coins: {
    flex: 1,
  },

  coins_list: {
    marginHorizontal: 14,
  },
});
