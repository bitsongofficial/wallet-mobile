import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { observer } from "mobx-react-lite";
import { Coin } from "classes";
import { COLOR } from "utils";
import { useTheme } from "hooks";
import { SendController } from "./classes";
import { Button, Icon2 } from "components/atoms";
import { Numpad } from "components/moleculs";
import { CardSelectCoin } from "./components/organisms";
import { Footer } from "./components/moleculs";

type Props = {
  controller: SendController;
  onPressSelectCoin(): void;
  onPressNext(): void;
};

export default observer<Props>(function InsertImport({
  controller,
  onPressSelectCoin,
  onPressNext,
}) {
  const theme = useTheme();
  const { creater } = controller;

  return (
    <>
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

      <TouchableOpacity onPress={onPressSelectCoin}>
        <CardSelectCoin coin={creater.coin} style={styles.select} />
      </TouchableOpacity>

      <Numpad
        onPress={controller.addAmountNumber}
        onPressRemove={controller.removeAmountNumber}
        style={styles.numpad}
      />

      <Footer
        isShowBack={false}
        onPressCenter={onPressNext}
        centerTitle="Continue"
      />
    </>
  );
});

const styles = StyleSheet.create({
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
});
