import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { COLOR, hexAlpha } from "utils";

type Props = {
  style?: StyleProp<ViewStyle>;
  source?: ImageSourcePropType | null;
};

const placeholder = require("assets/images/mock/avatar.png");

export default ({ style, source }: Props) => (
  <View style={[styles.container, style]}>
    <Image style={styles.img} source={source || placeholder} />
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
