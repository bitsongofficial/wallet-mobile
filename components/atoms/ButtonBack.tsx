import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "hooks";
import Icon2 from "./Icon2";

type ButtonProps = {
  onPress(): void;
  style?: StyleProp<ViewStyle>;
  text?: string;
};

export default ({ onPress, style, text }: ButtonProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.inner}>
          <Icon2 name="chevron_left" size={18} />
          <Text style={[styles.text, theme.text.primary]}>
            {text || "back"}
          </Text>
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
    marginLeft: 4,
  },
});
