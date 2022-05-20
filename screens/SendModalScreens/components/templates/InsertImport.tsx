import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { observer } from "mobx-react-lite";
import { Coin } from "classes";
import { COLOR, round } from "utils";
import { useTheme } from "hooks";
import { Button, Icon2 } from "components/atoms";
import { Numpad } from "components/moleculs";
import { SendController } from "../../classes";
import { CardSelectCoin } from "../moleculs";
import { Footer } from "../atoms";

type Props = {
  controller: SendController;
  onPressSelectCoin(): void;
  onPressNext(): void;
  onPressBack(): void;
};

export default observer<Props>(function InsertImport({
  controller,
  onPressSelectCoin,
  onPressNext,
  onPressBack,
}) {
  const theme = useTheme();
  const creater = controller.creater;

  const tokenBalance = useMemo(() => {
    if (creater.coin?.rate) {
      const value = Coin.culcTokenBalance(
        parseFloat(creater.amount),
        creater.coin.rate
      );
      if (value) {
        return round(value);
      }
    }
  }, [creater.amount, creater.coin?.rate]);

  return (
    <>
      <View style={styles.row}>
        <Text style={[styles.usd, theme.text.primary]}>
          {creater.amount || 0} $
        </Text>
        <View>
          <Button
            text="MAX"
            onPress={creater.setMax}
            contentContainerStyle={styles.maxButtonContent}
          />
        </View>
      </View>

      {creater.coin && (
        <View style={styles.coin}>
          <Text style={styles.coinBalance}>
            {tokenBalance || 0} {creater.coin?.info.coinName}
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
        onPressCenter={onPressNext}
        onPressBack={onPressBack}
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
