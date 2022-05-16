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
        style={[theme.input.component, styles.component, inputStyle]}
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
  component: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 14,
    // lineHeight: 25,
    // https://stackoverflow.com/a/68458803
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 18,
  },
  autocomplite: {
    position: "absolute",
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 18,
    top: 19,
    left: 25,
  },
});
