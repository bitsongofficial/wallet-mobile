import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { View } from "components/Themed";
import { Icon2 } from "components/atoms";
import { useTheme } from "hooks";

type Props = {
  text?: string;
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export default ({ children, text, style }: Props) => {
  const theme = useTheme();
  return (
    <View>
      <Text style={[styles.text, theme.text.primary, style]}>
        {text || children}
      </Text>
      <Icon2 name="chevron_right" />
    </View>
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
