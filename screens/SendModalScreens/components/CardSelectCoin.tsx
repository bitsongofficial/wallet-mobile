import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { observer } from "mobx-react-lite";
import { Coin } from "classes";
import { useTheme } from "hooks";
import { Card, Icon } from "components/atoms";
import { hexAlpha } from "utils";

type Props = {
  coin?: Coin;
  style?: StyleProp<ViewStyle>;
};

export default observer<Props>(function CardWallet({ coin, style }) {
  const theme = useTheme();
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.left}>
        <Image
          source={require("assets/images/mock/logo_bitsong.png")}
          style={styles.image}
        />
        <Text style={[styles.title, theme.text.primary]}>
          {coin?.info.brand}
        </Text>
        <Text style={styles.balance}>
          {coin?.info.balance} {coin?.info.coinName}
        </Text>
      </View>
      <Icon name="arrow_down" />
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#14142E",
    height: 70,
    alignItems: "center",
    padding: 23,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 27,
    height: 27,
    marginRight: 20,
    tintColor: hexAlpha("#FFFFFF", 20),
  },
  title: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 15,
    lineHeight: 19,

    marginRight: 17,
  },
  balance: {
    color: "#4C61E5",
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    // lineHeight: '111.1%',
  },
});
