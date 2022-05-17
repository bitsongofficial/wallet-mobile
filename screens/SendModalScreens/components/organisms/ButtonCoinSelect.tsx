import { useCallback } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { observer } from "mobx-react-lite";
import { useTheme } from "hooks";
import { Coin } from "classes";

type ButtonCoinSelectProps = {
  coin: Coin;
  onPress(coin: Coin): void;
};

export default observer<ButtonCoinSelectProps>(function ButtonCoinSelect({
  coin,
  onPress,
}) {
  const handlePress = useCallback(() => onPress(coin), [coin, onPress]);
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.coin}>
        <View style={styles.row}>
          <Text style={[styles.brand, theme.text.primary]}>
            {coin.info.brand}
          </Text>
          <Text style={[styles.balance, theme.text.colorText]}>
            {coin.balance} {coin.info.coinName}
          </Text>
        </View>
        <Image source={coin.info.logo} style={styles.image} />
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  coin: {
    flexDirection: "row",
    marginTop: 24,
    paddingVertical: 5,
    alignItems: "center",
  },

  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  brand: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 15,
    lineHeight: 19,
  },
  balance: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    // line-height: 111.1%;
  },

  image: {
    width: 24,
    height: 24,
    tintColor: "grey",
    marginLeft: 25,
  },
});
