import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { observer } from "mobx-react-lite";
import { Card, Icon } from "components/atoms";
import { useTheme } from "hooks";
import { IPerson } from "classes/types";
import { Coin, Transaction } from "classes";
import { COLOR } from "utils";
import { SendController } from "screens/SendModalScreens/classes";

type Props = {
  creater: SendController["creater"];
  onPress(): void;
};

export default observer<Props>(function CardWallet({
  creater,
  onPress,
}: Props) {
  const theme = useTheme();
  const { addressInput, amount, coin, receiver } = creater;
  return (
    <>
      <Card style={styles.container}>
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
          <Text style={[styles.text, styles.mr17, theme.text.colorText]}>
            as
          </Text>
          <Text style={[styles.text, theme.text.primary]}>
            28,345 {coin?.info.coinName.toUpperCase()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.text, styles.mr17, theme.text.colorText]}>
            to
          </Text>
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
          <Text style={[styles.text, theme.text.primary]}>
            {addressInput.value}
          </Text>
        </View>
      </Card>

      <View style={styles.funds}>
        <Text style={[styles.caption, theme.text.primary]}>
          Your funds come from
        </Text>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.Dark3,
    padding: 27,
    paddingTop: 33,
  },
  mr17: { marginRight: 17 },
  mr40: { marginRight: 40 },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
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
  // --------
  funds: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 27,
  },
  caption: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 13,
    lineHeight: 16,
  },
  // --------
});
