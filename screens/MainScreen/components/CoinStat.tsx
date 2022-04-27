import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { hexAlpha } from "utils";
import Coin from "../classes/Coin";

type Props = {
  coin: Coin;
  style?: StyleProp<ViewStyle>;
};

export default ({ coin, style }: Props) => (
  <View style={[styles.container, style]}>
    <View style={styles.imageContainer}>
      <Image source={{ uri: coin.info.logo }} style={styles.image} />
    </View>

    <View style={styles.about}>
      <View style={styles.texts}>
        <Text style={styles.primary}>{coin.info.brand}</Text>
        <Text style={styles.secondary}>{coin.info.coinName}</Text>
      </View>

      <View style={styles.numbers}>
        <Text style={styles.primary}>{coin.info.balance}</Text>
        <Text style={styles.secondary}>{coin.reward} $</Text>
      </View>
    </View>
  </View>
);

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
    backgroundColor: "orange",
  },
  image: {},
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
    fontFamily: "Circular Std",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
  },
  secondary: {
    color: "#FFFFFF",
    opacity: 0.5,
    fontFamily: "Circular Std",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    // lineHeight: '111.1%',
  },
});
