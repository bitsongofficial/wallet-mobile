import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useStore, useTheme } from "hooks";
import { ButtonBack } from "components/atoms";
import { ButtonCoinSelect } from "../moleculs";
import { SendController } from "screens/SendModalScreens/classes";

type Props = {
  controller: SendController;
  onBack(): void;
};

export default function SelectCoin({ controller, onBack }: Props) {
  const theme = useTheme();
  const { wallet } = useStore();

  const selectCoin = useCallback(
    (coin) => {
      controller.creater.setCoin(coin);
      onBack();
    },
    [controller, onBack]
  );

  return (
    <View style={styles.container}>
      <ButtonBack onPress={onBack} />
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
    marginTop: 15,
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
