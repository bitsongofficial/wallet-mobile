import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "hooks";

const numpad = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "C"],
];

type NumpadProps = {
  onPress(num: string): void;
  onPressRemove(): void;
  style?: StyleProp<ViewStyle>;
};

export default function Numpad({ onPress, style, onPressRemove }: NumpadProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      {numpad.map((row, index) => (
        <View key={index} style={styles.row}>
          {row.map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => (num === "C" ? onPressRemove() : onPress(num))}
            >
              <View style={styles.num}>
                <Text style={[styles.text, theme.text.primary]}>{num}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: "space-around",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  num: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
  },
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 24,
    lineHeight: 27,
  },
});
