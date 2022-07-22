import { useMemo } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button, Icon2 } from "components/atoms";
import { useStore, useTheme } from "hooks";
import { COLOR } from "utils";
import { ICoin, IPerson } from "classes/types";
import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import { SupportedCoins } from "constants/Coins";
import { Contact } from "stores/ContactsStore";

type Props = {
  /** How many $ we will send */
  amount: string;
  /** Account details from which we send */
  coinData: ICoin;
  /** The address we ship to */
  address: string;

  onPressUp(): void;
  style?: StyleProp<ViewStyle>;
};

export default observer(function CardWillSend({
  address,
  amount,
  coinData,

  onPressUp,
  style,
}: Props) {
  const theme = useTheme();
  const { configs, contacts, coin } = useStore();

  const receiver: Contact | undefined = useMemo(
    () => contacts.contacts.find((c) => c.address === address),
    [address]
  );

  const addContact = useCallback(() => {
    async () => {
      // TODO: need get person data by address. May be loader needed?
      // contacts.add(await DApp.getPersonByAddress(address));
    };
  }, [address]);

  const coinsValue = useMemo(
    () =>
      coin.fromFIATToAssetAmount(parseFloat(amount), SupportedCoins.BITSONG),
    [amount]
  );

  const shortAddress = `${address.substring(0, 10)}..${address.slice(-7)}`;
  const shortFrom = `${coinData.address.substring(
    0,
    10
  )}..${coinData.address.slice(-7)}`;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.title}>
        <Text style={[styles.text, styles.titleText, theme.text.colorText]}>
          You will send
        </Text>
        <TouchableOpacity onPress={onPressUp}>
          <Icon2 name="arrow_up" size={18} stroke={COLOR.Marengo} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.transferAmount, theme.text.primary]}>
        {amount} $
      </Text>

      <View style={styles.row}>
        <Text style={[styles.text, styles.w30, theme.text.colorText]}>as</Text>
        <Text style={[styles.text, theme.text.primary]}>
          {coinsValue} {coinData.coinName.toUpperCase()}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.text, styles.w66, theme.text.colorText]}>
          from
        </Text>
        <Text style={[styles.text, theme.text.primary]}>{shortFrom}</Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.text, styles.w30, theme.text.colorText]}>to</Text>
        {receiver ? (
          <>
            <View style={styles.avatar} />
            {/* <Image style={styles.avatar} source={{ uri: receiver.avatar }} /> */}
            <Text style={[styles.text, theme.text.primary]}>
              {receiver.nickname}
            </Text>
          </>
        ) : (
          <Button
            text="Add Contact"
            onPress={addContact}
            contentContainerStyle={styles.buttonAdd}
          />
        )}
      </View>

      <View style={styles.row}>
        <Text style={[styles.text, styles.w66, theme.text.colorText]}>
          address
        </Text>
        <Text style={[styles.text, theme.text.primary]}>{shortAddress}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: COLOR.Dark3,
    padding: 27,
    paddingTop: 33,
  },
  w66: { width: 66 },
  w30: { width: 30 },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
  },
  titleText: {
    fontWeight: "400",

    fontSize: 16,
    lineHeight: 20,
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
    fontSize: 42,
    lineHeight: 53,

    marginTop: 16,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginRight: 12,

    backgroundColor: "grey",
  },
  buttonAdd: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
