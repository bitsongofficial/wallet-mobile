import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { COLOR } from "utils";
import { useTheme } from "hooks";

type Props = {
  value: string[];
  style?: StyleProp<ViewStyle>;
};

export default ({ value = [], style }: Props) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, style]}>
      {value.map((value, index) =>
        value ? (
          <Text key={index} style={[styles.num, theme.text.primary]}>
            {value}
          </Text>
        ) : (
          <View key={index} style={styles.placeholder} />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
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
