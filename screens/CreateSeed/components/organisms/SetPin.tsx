import { StyleSheet } from "react-native";
import { Numpad } from "screens/SendModalScreens/components"; // todo: make common component
import { Pin } from "classes";
import { PinCode } from "../moleculs";
import { observer } from "mobx-react-lite";

type Props = { pin: Pin };

export default observer(({ pin }: Props) => (
  <>
    <PinCode value={pin.value} style={styles.pin} />
    <Numpad
      onPressRemove={pin.remove}
      onPress={pin.push}
      style={styles.numpad}
    />
  </>
));

const styles = StyleSheet.create({
  pin: { flex: 1 },
  numpad: {
    marginHorizontal: 15,
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 30,
  },
});
