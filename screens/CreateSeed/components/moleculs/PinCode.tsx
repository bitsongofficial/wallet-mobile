import { useMemo } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Pin } from "classes";
import { COLOR } from "utils";
import { useTheme } from "hooks";

type Props = {
  value?: Pin["value"];
  style?: StyleProp<ViewStyle>;
};

export default ({ value = "", style }: Props) => {
  const theme = useTheme();
  const nums = useMemo(
    () => [...value.split(""), ...new Array(Pin.max - value.length).fill(null)],
    [value]
  );

  return (
    <View style={[styles.container, style]}>
      {nums.map((num, index) => (
        <View key={index} style={styles.item}>
          {num ? (
            <Text style={[styles.num, theme.text.primary]}>{num}</Text>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  item: {
    width: 30,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  num: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 40,
  },
  placeholder: {
    width: 6,
    height: 10,
    borderRadius: 50,
    backgroundColor: COLOR.White,
    opacity: 0.15,
  },
});
