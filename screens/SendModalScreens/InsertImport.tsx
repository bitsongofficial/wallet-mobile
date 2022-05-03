import { useCallback, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SendCoinStackParamList } from "navigation/SendCoinStack/types";
import { SendCoinContext } from "navigation/SendCoinStack/context";
import { useTheme } from "hooks";
import { Button, Icon } from "components/atoms";
import { CardSelectCoin, Numpad } from "./components";

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
      <View style={styles.wrapper33}>
        <View style={styles.row}>
          <Text style={[styles.usd, theme.text.primary]}>934.45$</Text>
          <View>
            <Button>MAX</Button>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.balance}>28,345 {coin?.info.coinName}</Text>
          <Icon name="arrow_down" />
        </View>
      </View>

      <TouchableOpacity onPress={select}>
        <CardSelectCoin coin={coin} style={styles.select} />
      </TouchableOpacity>

      <Numpad
        onPress={console.log}
        style={{
          flexGrow: 1,
          marginVertical: 10,
        }}
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
  wrapper33: { marginHorizontal: 33 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 29,
  },
  usd: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 54,
  },
  balance: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 21,
    lineHeight: 27,
    color: "#4863E8",
  },
  select: {
    marginHorizontal: 13,
    marginTop: 39,
  },

  // ------ button ------
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
