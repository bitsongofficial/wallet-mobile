import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { useTheme } from "hooks";

type Props = {
  text?: string;
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export default ({ children, text, style }: Props) => {
  const theme = useTheme();
  return (
    <Text style={[styles.text, theme.text.primary, style]}>
      {text || children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
    opacity: 0.5,
  },
});