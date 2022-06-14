import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";
import { Icon2 } from "components/atoms";
import { useTheme } from "hooks";
import { COLOR } from "utils";

type Props = {
  text?: string | number;
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export default ({ children, text, style }: Props) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.text, theme.text.primary, style]}>
        {text || children}
      </Text>
      <Icon2 name="chevron_right" stroke={COLOR.Lavender} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,

    marginRight: 17,
    opacity: 0.5,
  },
});
