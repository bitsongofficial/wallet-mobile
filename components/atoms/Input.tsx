import { useMemo } from "react";
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
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

type Props = TextInputProps & {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  autocomplite?: string | null;
  bottomsheet?: boolean;
};

export default ({
  inputStyle,
  style,
  autocomplite,
  bottomsheet,
  ...props
}: Props) => {
  const theme = useTheme();
  const Component = useMemo(
    () => (bottomsheet ? BottomSheetTextInput : TextInput),
    [bottomsheet]
  );

  return (
    <View style={[styles.container, theme.input.container, style]}>
      {autocomplite && (
        <Text style={[theme.input.autocomplite, styles.autocomplite]}>
          {autocomplite}
        </Text>
      )}
      <Component
        style={[theme.input.component, styles.component, inputStyle]}
        placeholderTextColor={theme.input.placeholder}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    overflow: "hidden",
  },
  component: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 14,
    // https://stackoverflow.com/a/68458803
    paddingHorizontal: 24,
    marginVertical: 19,
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
