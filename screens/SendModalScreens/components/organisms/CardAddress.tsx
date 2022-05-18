import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { Card, Icon2 } from "components/atoms";
import { useTheme } from "hooks";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { COLOR, InputHandler } from "utils";

type Props = {
  input: InputHandler;
  onPressQR(): void;
  style?: StyleProp<ViewStyle>;
};

export default observer<Props>(function CardWallet({
  onPressQR,
  input,
  style,
}: Props) {
  const theme = useTheme();
  return (
    <Card style={[styles.container, style]}>
      <TextInput
        style={theme.text.primary}
        placeholder="Public Address"
        onChangeText={input.set}
        onFocus={input.focusON}
        onBlur={input.focusOFF}
        placeholderTextColor={theme.input.placeholder}
        value={input.value || ""}
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
    backgroundColor: COLOR.Dark3,
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
