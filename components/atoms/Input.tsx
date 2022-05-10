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
    <View style={[styles.container, theme.input.container, style]}>
      <TextInput
        // style={[theme.text.primary, inputStyle]}
        style={[theme.input.component]}
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme.input.placeholder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 19,
    paddingHorizontal: 24,
    borderRadius: 50,
  },
});
