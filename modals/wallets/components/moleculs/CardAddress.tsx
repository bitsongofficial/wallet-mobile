import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { observer } from "mobx-react-lite";
import { Card, Icon2 } from "components/atoms";
import { useTheme } from "hooks";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { COLOR, InputHandler } from "utils";
import { useMemo } from "react";
import { trimAddress } from "utils/string";

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
  const value = useMemo(() => {
    const text = input.value;
    if (input.isFocused || text.length < 25) return text;
    return trimAddress(text);
  }, [input.isFocused, input.value]);

  return (
    <Card style={[styles.container, style]}>
      <TextInput
        style={[theme.text.primary, styles.input]}
        placeholder="Public Address"
        onChangeText={input.set}
        onFocus={input.focusON}
        onBlur={input.focusOFF}
        placeholderTextColor={theme.input.placeholder}
        value={value}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onPressQR} style={styles.touchable}>
          <Icon2 name="scan" stroke={COLOR.RoyalBlue} size={18} />
        </TouchableOpacity>
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.Dark3,
    height: 70,
    justifyContent: "space-between",
    flexDirection: "row",
    overflow: "hidden",
  },
  input: {
    paddingLeft: 26,
    flex: 1,
  },
  touchable: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    padding: 26,
  },
  buttonContainer: {
    justifyContent: "center",
  },
});
