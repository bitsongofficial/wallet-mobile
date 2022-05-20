import { useCallback, useState } from "react";
import { observer } from "mobx-react-lite";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore, useTheme } from "hooks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { COLOR } from "utils";
import { RootStackParamList } from "types";
import { users } from "./mock";
import { Button, ButtonBack } from "components/atoms";
import { ChooseCoinValues } from "./components/moleculs";

type Props = NativeStackScreenProps<RootStackParamList, "ScannerQR">;

export default observer<Props>(function SendDetails({ navigation }: Props) {
  const theme = useTheme();
  const { wallet } = useStore();

  const [value1, setValue1] = useState("0");
  const [value2, setValue2] = useState("0");

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  // ---- MOCK -------
  const coin = wallet.coins[0];
  const receiver = users[0];
  const address = coin.info.address;
  const amount = 123;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper33}>
        <Text style={[styles.text, theme.text.colorText]}>You will send</Text>

        <Text style={[styles.transferAmount, theme.text.primary, styles.mt6]}>
          {amount}$
        </Text>

        <Text style={[styles.text, theme.text.secondary2, styles.mt6]}>
          28,345 {coin.info.coinName.toUpperCase()}
        </Text>

        <Text style={[styles.text, theme.text.primary, styles.mt28]}>
          Choose origin of fund
        </Text>
      </View>
      <View style={styles.wrapper26}>
        <ChooseCoinValues
          value={value1}
          onChangeText={setValue1}
          style={styles.first}
          coin={wallet.coins[0]}
        />
        <ChooseCoinValues
          value={value2}
          onChangeText={setValue2}
          style={styles.second}
          coin={wallet.coins[1]}
        />
      </View>
      <View style={styles.buttonContainer}>
        <ButtonBack onPress={goBack} style={styles.buttonBack} />
        <Button
          contentContainerStyle={styles.buttonContent}
          textStyle={styles.buttonText}
          onPress={() => {}}
        >
          Preview Send
        </Button>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.Dark3,
    flexGrow: 1,
  },
  wrapper33: { marginHorizontal: 33 },
  wrapper26: { marginHorizontal: 26 },
  mt6: { marginTop: 6 },
  mt28: { marginTop: 28 },

  first: {
    marginTop: 47,
  },
  second: {
    marginTop: 60,
  },

  transferAmount: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 40,
    lineHeight: 51,

    marginTop: 6,
  },
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 23,
  },

  // ------ button ------ TODO: Make common component
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginVertical: 8,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  buttonContent: {
    paddingVertical: 18,
    paddingHorizontal: 36,
  },
  buttonText: {
    fontSize: 15,
    lineHeight: 19,
  },
  buttonBack: {
    position: "absolute",
    bottom: 18,
    left: 33,
  },
});
