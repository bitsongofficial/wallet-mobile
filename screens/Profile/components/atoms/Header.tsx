import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon2 } from "components/atoms";
import { COLOR, hexAlpha } from "utils";

type Props = {
  onPressClose(): void;
  style?: StyleProp<ViewStyle>;
};

export default ({ onPressClose, style }: Props) => (
  <View style={[styles.container, style]}>
    <Icon2 name="logo_black" size={40} />
    <TouchableOpacity style={styles.button} onPress={onPressClose}>
      <Icon2 name="close" size={18} stroke={COLOR.White} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 55,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: hexAlpha(COLOR.White, 10),
    padding: 13,
    borderRadius: 35,
  },
});
