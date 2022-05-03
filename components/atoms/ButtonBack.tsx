import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "hooks";
import Icon from "./Icon";

type ButtonProps = {
  onPress(): void;
  style: StyleProp<ViewStyle>;
};

export default ({ onPress, style }: ButtonProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.inner}>
          <Icon name="test" />
          <Text style={[styles.text, theme.text.primary]}>back</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  inner: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 14,
  },
});
