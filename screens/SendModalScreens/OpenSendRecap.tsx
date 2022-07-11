import useGlobalBottomsheet from "hooks/useGlobalBottomsheet";
import { InputHandler } from "utils";
import { Footer } from "./components/atoms";
import { StyleSheet, View } from "react-native";
import Recap from "components/organisms/Recap";
import { ICoin } from "classes/types";

type SendRecapConfig = {
  amount: string;
  from: ICoin;
  to: string;
  onDone(): void;
  onReject(): void;
};

export async function openSendRecap({
  from,
  to,
  amount,
  onDone,
  onReject,
}: SendRecapConfig) {
  const flags = { accepted: false };

  const gbs = useGlobalBottomsheet();

  const send = () => {
    try {
      flags.accepted = true;
      onDone();
    } catch (e) {
      console.log(e);
    }
    gbs.close();
  };

  const handleClose = () => {
    if (!flags.accepted) {
      try {
        onReject();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const memo = new InputHandler();

  gbs.setProps({
    snapPoints: [500],
    onClose: handleClose,
    children: () => (
      <View style={styles.wrapper}>
        <View style={styles.spacer}>
          <Recap
            bottomSheet
            amount={amount}
            coin={from}
            address={to}
            style={styles.recap}
            onPress={() => {}}
            memoInput={memo}
          />
        </View>
        <Footer isShowBack={false} onPressCenter={send} centerTitle="Confirm" />
      </View>
    ),
  });
  gbs.expand();
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  wrapper: { flex: 1 },
  header: { marginTop: 10 },
  spacer: {
    marginHorizontal: 30,
    flex: 1,
    justifyContent: "flex-end",
  },
  recap: { marginTop: 100 },
});
