import { StyleSheet, View } from "react-native";
import { COLOR, hexAlpha } from "utils";

type Props = {
  isActive: boolean;
};

export default ({ isActive }: Props) => (
  <View style={[styles.container, isActive && styles.active]}>
    {isActive && <View style={styles.dot} />}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: 21,
    height: 21,
    backgroundColor: hexAlpha(COLOR.White, 10),
    borderRadius: 21,

    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundColor: COLOR.White,
  },
  dot: {
    width: 13,
    height: 13,
    borderRadius: 13,
    backgroundColor: COLOR.RoyalBlue3,
  },
});
