import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { hexAlpha } from "utils";
import Coin from "classes/Coin";
import { observer } from "mobx-react-lite";

type Props = {
  coin: Coin;
  style?: StyleProp<ViewStyle>;
};

export default observer(({ coin, style }: Props) => {
  const balance = coin.balance.toLocaleString("en");
  const balanceUSD = coin.balanceUSD
    ? coin.balanceUSD.toLocaleString("en")
    : undefined;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.imageContainer}>
        <Image source={coin.info.logo} style={styles.image} />
      </View>

      <View style={styles.about}>
        <View style={styles.texts}>
          <Text style={styles.primary}>{coin.info.brand}</Text>
          <Text style={styles.secondary}>{coin.info.coinName}</Text>
        </View>

        <View style={styles.numbers}>
          <Text style={styles.primary}>{balance}</Text>
          {balanceUSD && <Text style={styles.secondary}>{balanceUSD} $</Text>}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: hexAlpha("#FFFFFF", 10),
    height: 70,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 20,
    flex: 1,
    flexDirection: "row",
  },

  about: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageContainer: {
    marginRight: 14,
    width: 30,
    height: 30,
  },
  image: {
    width: 30,
    height: 30,
  },
  texts: {
    flex: 1,
    alignItems: "flex-start",
  },
  numbers: {
    flex: 1,
    alignItems: "flex-end",
  },
  primary: {
    color: "#FFFFFF",
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
  },
  secondary: {
    color: "#FFFFFF",
    opacity: 0.5,
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    // lineHeight: '111.1%',
  },
});
