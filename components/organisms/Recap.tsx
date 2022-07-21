import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Input } from "components/atoms";
import { COLOR, InputHandler } from "utils";
import { CardWillSend } from "components/moleculs";
import { observer } from "mobx-react-lite";
import { ICoin } from "classes/types";

type Props = {
  coin: ICoin;
  amount: string;
  address: string;

  onPress(): void;
  style?: StyleProp<ViewStyle>;
  memoInput: InputHandler;
  /** if use in bottomsheet */
  bottomSheet?: boolean;
};

export default observer(function Recap({
  address,
  amount,
  coin,
  onPress,

  style,
  memoInput,
  bottomSheet,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <CardWillSend
        address={address}
        amount={amount}
        coinData={coin}
        onPressUp={onPress}
      />

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
  container: {},
  input: {
    backgroundColor: COLOR.Dark3,
    marginTop: 24,
  },
  // --------
});
