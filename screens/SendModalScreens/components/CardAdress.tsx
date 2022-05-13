import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { Card, Icon2 } from "components/atoms";
import { useTheme } from "hooks";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { COLOR } from "utils";

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
        style={theme.text.primary}
        placeholder="Public Address"
        onChangeText={onChange}
        placeholderTextColor={theme.input.placeholder}
        value={value}
      />
      <TouchableOpacity onPress={onPressQR}>
        <View style={styles.iconContainer}>
          <Icon2 name="scan" stroke={COLOR.RoyalBlue} size={18} />
        </View>
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
  iconContainer: {
    padding: 8,
    borderRadius: 16,
  },
});
