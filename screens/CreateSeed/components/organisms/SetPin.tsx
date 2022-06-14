import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { observer } from "mobx-react-lite";
import { Numpad } from "components/moleculs";
import { Pin } from "classes";
import { PinCode } from "../moleculs";

type Props = { pin: Pin };

export default observer(({ pin }: Props) => {
  const numpad = useMemo(Pin.getRandomKeyboard, []);
  return (
    <>
      <PinCode value={pin.value} style={styles.pin} />
      <Numpad
        onPressRemove={pin.remove}
        onPress={pin.push}
        style={styles.numpad}
        numpad={numpad}
      />
    </>
  );
});

const styles = StyleSheet.create({
  pin: { flex: 1 },
  numpad: {
    marginHorizontal: 15,
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 30,
  },
});
