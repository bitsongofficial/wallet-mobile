import { useCallback, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SendCoinStackParamList } from "navigation/SendCoinStack/types";
import { SendCoinContext } from "navigation/SendCoinStack/context";
import { useTheme } from "hooks";
import { Button, Icon2 } from "components/atoms";
// import { CardSelectCoin, Numpad } from "./components";
import { COLOR } from "utils";

type Props = NativeStackScreenProps<SendCoinStackParamList, "InsertImport">;

export default function InsertImport({ navigation }: Props) {
  const { coin } = useContext(SendCoinContext);
  const theme = useTheme();

  const select = useCallback(() => navigation.push("SelectCoin"), []);
  const navToSelectReceiver = useCallback(
    () => navigation.push("SelectReceiver"),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.wrapper30}>
        <View style={styles.row}>
          <Text style={[styles.usd, theme.text.primary]}>934.45$</Text>
          <View>
            <Button contentContainerStyle={styles.maxButtonContent}>MAX</Button>
          </View>
        </View>

        <View style={styles.coin}>
          <Text style={styles.coinBalance}>28,345 {coin?.info.coinName}</Text>
          <Icon2 name="upNdown" size={18} stroke={COLOR.RoyalBlue} />
        </View>
      </View>

      <TouchableOpacity onPress={select}>
        <CardSelectCoin coin={coin} style={styles.select} />
      </TouchableOpacity>

      <Numpad
        onPress={console.log}
        onPressRemove={() => console.log("remove")}
        style={styles.numpad}
      />

      <View style={styles.buttonContainer}>
        <Button
          contentContainerStyle={styles.buttonContent}
          textStyle={styles.buttonText}
          onPress={navToSelectReceiver}
        >
          Continue
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1 },
  wrapper30: { marginHorizontal: 30 },
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
    marginHorizontal: 30,
    marginTop: 39,
  },

  maxButtonContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },

  numpad: {
    flexGrow: 1,
    marginVertical: 10,
    justifyContent: "space-around",
    marginHorizontal: 45,
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
});
