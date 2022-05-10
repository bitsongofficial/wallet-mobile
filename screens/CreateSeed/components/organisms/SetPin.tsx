import { StyleSheet, View } from "react-native";
import { Numpad } from "screens/SendModalScreens/components"; // todo: make common component
import { useTheme } from "hooks";
import { Subtitle, Title } from "../atoms";
import { PinCode } from "../moleculs";

type Props = {
  onPress(value: string): void;
  pin: string[];
};

export default ({ onPress, pin }: Props) => {
  const theme = useTheme();
  return (
    <>
      <View style={styles.container}>
        <Title>Set PIN</Title>
        <Subtitle style={styles.subtitle}>
          This is the only way you will be able to {"\n"}recover your account.
          Please store it {"\n"}somewhere safe!
        </Subtitle>
        <PinCode value={pin} style={styles.pin} />
        <Numpad onPress={onPress} style={styles.numpad} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  subtitle: {
    marginTop: 8,
  },
  pin: {
    flex: 1,
  },
  numpad: {
    marginHorizontal: 15,
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 30,
  },
});
