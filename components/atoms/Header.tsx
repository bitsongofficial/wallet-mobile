import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type Props = {
  Left?: JSX.Element;
  Center?: JSX.Element;
  Right?: JSX.Element;

  style?: StyleProp<ViewStyle>;
};

export default ({ style, Center, Left, Right }: Props) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>{Left}</View>
      <View style={styles.center}>{Center}</View>
      <View style={styles.right}>{Right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 56,
  },
  left: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  right: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
  },
});
