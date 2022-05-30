import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { useTheme } from "hooks";

type Props = {
  value?: string;
  onChangeText?(value: string): void;
  placeholder?: string;

  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export default ({
  onChangeText,
  value,
  placeholder,
  inputStyle,
  style,
}: Props) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={[styles.input, theme.text.primary, inputStyle]}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme.text.secondary.color}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#14142E",
    paddingVertical: 19,
    paddingHorizontal: 25,
    borderRadius: 50,
  },
  input: {},
});
