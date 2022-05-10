import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { Card, Icon } from "components/atoms";
import { useTheme } from "hooks";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  value: string;
  onChange(value: string): void;
  onPressQR(): void;
  style?: StyleProp<ViewStyle>;
};

export default observer<Props>(function CardWallet({
  value,
  onChange,
  onPressQR,
  style,
}: Props) {
  const theme = useTheme();
  return (
    <Card style={[styles.container, style]}>
      <TextInput
        style={[styles.input, theme.text.primary]}
        placeholder="Public Address"
        onChangeText={onChange}
        placeholderTextColor={theme.input.placeholder}
        value={value}
      />
      <TouchableOpacity onPress={onPressQR}>
        <Icon name="qr_code" />
      </TouchableOpacity>
    </Card>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#14142E",
    height: 70,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 26,
  },
  input: {},
});
