import { useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useStore, useTheme } from "hooks";
import { ButtonBack } from "components/atoms";
import { ButtonCoinSelect } from "../moleculs";
import { SendController } from "screens/SendModalScreens/classes";
import { SupportedCoins } from "constants/Coins";
import { Coin } from "classes";
import { CoinClasses } from "core/types/coin/Dictionaries";

type Props = {
  controller: SendController;
  onBack(): void;
};

export default function SelectCoin({ controller, onBack }: Props) {
  const theme = useTheme();
  const { coin } = useStore();

  const selectCoin = useCallback(
    (coin) => {
      controller.creater.setCoin(coin);
      onBack();
    },
    [controller, onBack]
  );

  const coinsFromSupported = Object.values(SupportedCoins).map(sc => coin.coins.find(c => c.info.denom == CoinClasses[sc].denom()))
  const availableCoins = coinsFromSupported.filter(c => c != undefined) as Coin[]

  return (
    <View style={styles.container}>
      <ButtonBack onPress={onBack} />
      <Text style={[styles.title, theme.text.primary]}>Select Coin</Text>
      <Text style={[styles.subtitle, theme.text.secondary]}>
        Select also the chain where your coin come from
      </Text>

      {availableCoins.map(c => (
        <ButtonCoinSelect
          key={c?.info._id}
          coin={c}
          onPress={selectCoin}
        />
      ))}
    </View>
  )
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
