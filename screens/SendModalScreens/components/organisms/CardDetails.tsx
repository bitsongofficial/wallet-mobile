import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { Card, Icon } from "components/atoms";
import { useTheme } from "hooks";
import { IPerson } from "classes/types";
import { Coin } from "classes";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLOR } from "utils";

type Props = {
  address: string;
  receiver: IPerson;
  coin: Coin;
  amount: number;
  onPress(): void;
  style?: StyleProp<ViewStyle>;
};

export default observer<Props>(function CardWallet({
  address,
  amount,
  coin,
  receiver,
  onPress,
  style,
}: Props) {
  const theme = useTheme();
  return (
    <Card style={[styles.container, style]}>
      <View style={styles.title}>
        <Text style={[styles.text, theme.text.colorText]}>You will send</Text>
        <TouchableOpacity onPress={onPress}>
          <Icon name="arrow_down" />
        </TouchableOpacity>
      </View>

      <Text style={[styles.transferAmount, theme.text.primary]}>
        {amount} $
      </Text>

      <View style={styles.row}>
        <Text style={[styles.text, styles.mr17, theme.text.colorText]}>as</Text>
        <Text style={[styles.text, theme.text.primary]}>
          28,345 {coin.info.coinName.toUpperCase()}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.text, styles.mr17, theme.text.colorText]}>to</Text>
        <View style={styles.avatar} />
        {/* <Image  /> */}
        {receiver && (
          <Text style={[styles.text, theme.text.primary]}>
            {receiver.firstName}. {receiver.lastName}
          </Text>
        )}
      </View>

      <View style={styles.row}>
        <Text style={[styles.text, styles.mr40, theme.text.colorText]}>
          address
        </Text>
        <Text style={[styles.text, theme.text.primary]}>{address}</Text>
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.Dark3,
    padding: 27,
    paddingTop: 33,
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mr17: { marginRight: 17 },
  mr40: { marginRight: 40 },
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 23,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 13,
  },
  transferAmount: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 40,
    lineHeight: 51,

    marginTop: 16,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginRight: 12,

    backgroundColor: "grey",
  },
});
