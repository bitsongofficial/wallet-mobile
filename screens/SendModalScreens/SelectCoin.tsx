import { useCallback, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SendCoinStackParamList } from "navigation/SendCoinStack/types";
import { SendCoinContext } from "navigation/SendCoinStack/context";
import { useStore, useTheme } from "hooks";
import { ButtonBack } from "components/atoms";
import { ButtonCoinSelect } from "./components/organisms";

type Props = NativeStackScreenProps<SendCoinStackParamList, "SelectCoin">;

export default function SelectCoin({ navigation }: Props) {
  const theme = useTheme();
  const { wallet } = useStore();
  const context = useContext(SendCoinContext);

  const goBack = useCallback(() => navigation.goBack(), []);
  const selectCoin = useCallback(
    (coin) => {
      context.setCoin(coin);
      goBack();
    },
    [context.setCoin]
  );

  return (
    <View style={styles.container}>
      <ButtonBack onPress={goBack} />
      <Text style={[styles.title, theme.text.primary]}>Select Coin</Text>
      <Text style={[styles.subtitle, theme.text.secondary]}>
        Select also the chain where your coin come from
      </Text>

      {wallet.coins.map((coin) => (
        <ButtonCoinSelect
          key={coin.info._id}
          coin={coin}
          onPress={selectCoin}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 36,
  },
  title: {
    fontSize: 18,
    lineHeight: 23,

    marginTop: 24,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 18,
    marginTop: 10,
    width: "80%",
  },
});
