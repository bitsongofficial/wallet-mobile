import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { observer } from "mobx-react-lite";
import { COLOR } from "utils";
import { useStore, useTheme } from "hooks";
import { Numpad, Pagination } from "components/moleculs";
import { SendController } from "./classes";
import { Header } from "./components/moleculs";
import { Button, Icon2 } from "components/atoms";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CardSelectCoin } from "./components/organisms";
import { Coin } from "classes";

export default observer(function SendModal() {
  const theme = useTheme();
  const store = useStore();

  const controller = useMemo(
    () => new SendController(store.wallet.coins[0]),
    [store]
  );
  const { steps, creater } = controller;

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Header
          title="Send"
          subtitle={steps.title}
          Pagination={<Pagination acitveIndex={steps.active} count={3} />}
          style={styles.header}
        />

        <View style={styles.row}>
          <Text style={[styles.usd, theme.text.primary]}>
            {creater.amount || 0} $
          </Text>
          <View>
            <Button contentContainerStyle={styles.maxButtonContent}>MAX</Button>
          </View>
        </View>

        {creater.coin && (
          <View style={styles.coin}>
            <Text style={styles.coinBalance}>
              {!!creater.coin.rate &&
                Coin.culcTokenBalance(
                  parseFloat(creater.amount),
                  creater.coin.rate
                )}{" "}
              {creater.coin?.info.coinName}
            </Text>
            <Icon2 name="upNdown" size={18} stroke={COLOR.RoyalBlue} />
          </View>
        )}

        <TouchableOpacity>
          <CardSelectCoin coin={creater.coin} style={styles.select} />
        </TouchableOpacity>

        <Numpad
          onPress={controller.addAmountNumber}
          onPressRemove={controller.removeAmountNumber}
          style={styles.numpad}
        />

        <View style={styles.buttonContainer}>
          <Button
            contentContainerStyle={styles.buttonContent}
            textStyle={styles.buttonText}
            // onPress={navToSelectReceiver}
          >
            Continue
          </Button>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  wrapper: {
    marginHorizontal: 30,
    flex: 1,
  },
  header: { marginTop: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  usd: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 42,
    lineHeight: 53,
  },
  coin: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  coinBalance: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 21,
    lineHeight: 27,
    color: COLOR.RoyalBlue,
  },
  select: {
    marginTop: 39,
  },

  maxButtonContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  numpad: {
    flexGrow: 1,
    justifyContent: "space-around",
    padding: 15,
  },

  // ------ button ------ TODO: Make common component
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,

    // flexGrow: 1,
    backgroundColor: "orange",
  },
  buttonContent: {
    paddingVertical: 18,
    paddingHorizontal: 56,
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 19,
  },
});
