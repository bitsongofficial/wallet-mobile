import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { COLOR, hexAlpha } from "utils";

type Props = {
  text?: string;
  index?: number;
  style?: StyleProp<ViewStyle>;
  hidden?: boolean;
};

export default ({ index, text, style, hidden }: Props) => (
  <View style={[styles.container, style]}>
    <Text style={[styles.index, hidden && styles.hidden]}>{index}.</Text>
    <Text style={[styles.text, hidden && styles.hidden]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: hexAlpha(COLOR.White, 10),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 16,
  },
  hidden: {
    color: "transparent",
  },
  index: {
    fontFamily: "Circular Std",
    color: hexAlpha(COLOR.White, 40),
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 18,
    lineHeight: 23,
    marginRight: 6,
  },
  text: {
    fontFamily: "Circular Std",
    color: COLOR.White,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 20,
  },
});
