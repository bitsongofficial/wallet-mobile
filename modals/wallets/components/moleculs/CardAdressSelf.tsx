import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { Card, Icon } from "components/atoms";
import { useTheme } from "hooks";
import { Coin } from "classes";
import { COLOR } from "utils";
import { trimAddress } from "utils/string";
import moment from "moment";

type Props = {
  address: string;
  date?: Date;
  style?: StyleProp<ViewStyle>;
};

export default observer<Props>(function CardWallet({ address, date, style }) {
  const theme = useTheme();
  const shortAd = trimAddress(address);

  return (
    <Card style={[styles.card, style]}>
      <Icon name="arrow_up" />
      <View style={styles.description}>
        <Text style={[theme.text.primary]}>{shortAd}</Text>
        {date && <Text style={[theme.text.secondary]}>Sent {moment(date).format("d MMMM")}</Text>}
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
