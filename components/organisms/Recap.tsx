import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Input } from "components/atoms";
import { COLOR, InputHandler } from "utils";
import { Coin } from "classes";
import { CardWillSend } from "components/moleculs";
import { createContext, useContext } from "react";
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
  console.log("coin", coin);
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

// Example by

const testContext = createContext<Props>({}); //it's example. context != Props, just include data

export function withAnyContext(
  Component: React.Component | React.FunctionComponent
) {
  const { ...props } = useContext(testContext);

  return <Component {...props} />;
}

const styles = StyleSheet.create({
  container: {},
  input: {
    backgroundColor: COLOR.Dark3,
    marginTop: 24,
  },
  // --------
});
