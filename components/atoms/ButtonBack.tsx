import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "hooks";
import Icon2 from "./Icon2";
import { COLOR } from "utils";

type ButtonProps = {
  onPress?(): void;
  style?: StyleProp<ViewStyle>;
  text?: string;
  stroke?: string;
  textStyle?: StyleProp<TextStyle>;
};

export default ({ onPress, style, text, textStyle, stroke }: ButtonProps) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.inner}>
          <Icon2 name="chevron_left" size={18} stroke={stroke || COLOR.White} />
          <Text style={[styles.text, theme.text.primary, textStyle]}>
            {text || "Back"}
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
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 4,
  },
});
