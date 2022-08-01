import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { useTheme } from "hooks";
import { animated } from "@react-spring/native";

type Props = {
  text?: string;
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export default ({ children, text, style }: Props) => {
  const theme = useTheme();
  return (
    <animated.Text style={[styles.text, theme.text.primary, style]}>
      {text || children}
    </animated.Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 28,
    lineHeight: 35,
  },
});
