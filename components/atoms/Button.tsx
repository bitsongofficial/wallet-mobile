import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type ButtonProps = {
  onPress?(): void;
  mode?: "text" | "outlined" | "contained";
  text?: string;
  active?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default ({
  onPress,
  text,
  active,
  children,
  style,
  mode = "text",
}: ButtonProps) => (
  <View style={[styles.container, style]}>
    <TouchableOpacity onPress={onPress}>
      <View>
        <LinearGradient
          // Button Linear Gradient
          colors={["#4c669f", "#3b5998", "#192f6a"]}
          style={styles.button}
        >
          {text || typeof children === "string" ? (
            <Text style={styles.text}>{text || children}</Text>
          ) : (
            children
          )}
        </LinearGradient>
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "orange",
  },
  button: {},
  text: {},
});
