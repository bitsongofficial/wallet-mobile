import { useTheme } from "hooks";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { COLOR, hexAlpha } from "utils";

type Props = {
  text?: string;
  index?: number;
  style?: StyleProp<ViewStyle>;
  hidden?: boolean;
};

export default ({ index, text, style, hidden }: Props) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.index, hidden && styles.hidden]}>{index}.</Text>
      <Text style={[styles.text, hidden && styles.hidden]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: hexAlpha(COLOR.White, 10),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20, // 22 -
    paddingVertical: 11,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: hexAlpha(COLOR.White, 10),
  },
  hidden: {
    color: "transparent",
  },
  index: {
    fontFamily: "CircularStd",
    color: hexAlpha(COLOR.White, 40),
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 23,
    marginRight: 6,
  },
  text: {
    fontFamily: "CircularStd",
    color: COLOR.White,
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
  },
});
