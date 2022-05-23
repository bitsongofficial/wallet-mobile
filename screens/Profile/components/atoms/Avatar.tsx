import { Image, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { COLOR, hexAlpha } from "utils";

type Props = {
  style?: StyleProp<ViewStyle>;
};

export default ({ style }: Props) => (
  <View style={[styles.container, style]}>
    <Image
      style={styles.img}
      source={require("assets/images/mock/avatar.png")}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 8,
    borderColor: hexAlpha(COLOR.White, 10),
    backgroundColor: hexAlpha(COLOR.White, 10),
    borderRadius: 28,
  },
  img: {
    width: 28,
    height: 28,
    borderRadius: 28,
  },
});
