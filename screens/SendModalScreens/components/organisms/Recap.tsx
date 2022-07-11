import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { observer } from "mobx-react-lite";
import { Card, Icon, Input } from "components/atoms";
import { useStore, useTheme } from "hooks";
import { IPerson } from "classes/types";
import { Coin, Transaction } from "classes";
import { COLOR, InputHandler } from "utils";
import { SendController } from "screens/SendModalScreens/classes";
import { fromAmountToCoin, fromCoinToDefaultDenom, fromDollarsToAmount } from "core/utils/Coin";
import { trimAddress } from "utils/string";

type Props = {
  creater: SendController["creater"];
  onPress(): void;
  style?: StyleProp<ViewStyle>;
  memoInput: InputHandler;
  bottomSheet?: boolean;
};

export default observer<Props>(function CardWallet({
  creater,
  onPress,
  style,
  memoInput,
  bottomSheet
}: Props) {
  const theme = useTheme();
  const {configs} = useStore()
  const { addressInput, amount, coin, receiver } = creater;
  return (
    <View style={[styles.container, style]}>
      <Card style={styles.card}>
        <View style={styles.title}>
          <Text style={[styles.text, theme.text.colorText]}>You will send</Text>
          <TouchableOpacity onPress={onPress}>
            <Icon name="arrow_down" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.transferAmount, theme.text.primary]}>
          {amount} $
        </Text>

        {coin && coin.info.coin && <View style={styles.row}>
          <Text style={[styles.text, styles.mr17, theme.text.colorText]}>
            as
          </Text>
          <Text style={[styles.text, theme.text.primary]}>
            {fromAmountToCoin(fromDollarsToAmount(parseFloat(amount), fromCoinToDefaultDenom(coin.info.coin), configs.remote.prices))} {coin.info.coinName.toUpperCase()}
          </Text>
        </View>}

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
            {trimAddress(addressInput.value, 10)}
          </Text>
        </View>
      </Card>

      <Input
        bottomsheet={bottomSheet}
        placeholder="Add memo"
        value={memoInput.value}
        onChangeText={memoInput.set}
        onFocus={memoInput.focusON}
        onBlur={memoInput.focusOFF}
        style={styles.input}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
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
  input: {
    backgroundColor: COLOR.Dark3,
    marginTop: 24,
  },
  // --------
});
