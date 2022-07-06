import { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
import { COLOR } from "utils";

type Props = {
  style?: StyleProp<ViewStyle>;
};

export default function Backdrop({ style }: Props) {
  return <View style={[styles.backdrop, style]} />;
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: COLOR.Dark3,
    opacity: 0.75,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
