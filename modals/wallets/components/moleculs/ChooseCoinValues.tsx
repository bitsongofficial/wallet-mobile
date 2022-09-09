import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { useTheme } from "hooks";
import { COLOR, hexAlpha } from "utils";
import { Coin } from "classes";
import { Button, Card } from "components/atoms";

type Props = {
  coin: Coin;
  value: string;
  onChangeText(value: string): void;
  style: StyleProp<ViewStyle>;
};

export default observer<Props>(function ChooseCoinValues({
  coin,
  style,
  onChangeText,
  value,
}) {
  const theme = useTheme();

  const setMax = useCallback(
    () => onChangeText(coin.info.balance.toString()),
    [onChangeText, coin]
  );

  return (
    <View style={style}>
      <View style={styles.row}>
        {/* <Image /> */}
        <View style={styles.image} />
        <Text style={[styles.chainName, theme.text.primary]}>
          {coin.info.coinName} Chain
        </Text>
      </View>
      <Card style={styles.card}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, theme.text.primary]}
        />
        <Button onPress={setMax} contentContainerStyle={styles.buttonContent}>
          MAX
        </Button>
      </Card>
      <Text style={[styles.balance, theme.text.colorText]}>
        Available <Text style={theme.text.primary}>{coin.info.balance}</Text>{" "}
        {coin.info.coinName.toUpperCase()}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  chainName: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
  },
  image: {
    width: 21,
    height: 21,
    marginRight: 19,
    marginLeft: 9,
    // TODO: remove
    borderRadius: 21,
    backgroundColor: "grey",
  },
  balance: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 13,
    lineHeight: 16,
  },
  input: {
    height: 40,
  },
  buttonContent: {
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: hexAlpha(COLOR.White, 10),

    marginTop: 22,
    marginBottom: 8,
  },
});
