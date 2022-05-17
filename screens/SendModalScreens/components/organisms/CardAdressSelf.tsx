import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { Card, Icon } from "components/atoms";
import { useTheme } from "hooks";
import { Coin } from "classes";
import { COLOR } from "utils";

type Props = {
  coin?: Coin;
  style?: StyleProp<ViewStyle>;
};

export default observer<Props>(function CardWallet({ coin, style }) {
  const theme = useTheme();
  if (!coin) return null;
  const { address } = coin.info;
  const shortAd = `${address.substring(0, 16)}..${address.slice(-7)}`;

  return (
    <Card style={[styles.card, style]}>
      <Icon name="arrow_up" />
      <View style={styles.description}>
        <Text style={[theme.text.primary]}>{shortAd}</Text>
        <Text style={[theme.text.secondary]}>Sent on Feb 15</Text>
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLOR.Dark3,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 29,
    paddingVertical: 18,
    // justifyContent: "center",
  },
  description: {
    marginLeft: 16,
  },
});
