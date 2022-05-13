import {
  StyleProp,
  StyleSheet,
  Text,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useTheme } from "hooks";

type Props = TextInputProps & {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  autocomplite?: string | null;
};

export default ({ inputStyle, style, autocomplite, ...props }: Props) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, theme.input.container, style]}>
      {autocomplite && (
        <Text style={[theme.input.autocomplite, styles.autocomplite]}>
          {autocomplite}
        </Text>
      )}
      <TextInput
        style={[
          theme.input.component,
          inputStyle,
          // { backgroundColor: "orange" },
        ]}
        placeholderTextColor={theme.input.placeholder}
        {...props}
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
  autocomplite: {
    // backgroundColor: "red",
    position: "absolute",
    top: 19,
    left: 25,
  },
});
