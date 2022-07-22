import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useTheme } from "hooks";

type Props = {
  count: number;
  style?: StyleProp<ViewStyle>;
};

export default ({ count, style }: Props) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.count, theme.text.primary]}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4D60E4",
    borderRadius: 10,
    paddingHorizontal: 6,
  },
  count: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 15,
  },
});
