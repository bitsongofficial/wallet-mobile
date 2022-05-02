import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import ThemedGradient from "./ThemedGradient";
import { useTheme } from "hooks";

type Mode = "gradient" | "fill";

type ButtonProps = {
  onPress?(): void;
  mode?: Mode;
  text?: string;
  active?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default ({
  onPress,
  text,
  children,
  style,
  mode = "fill",
}: ButtonProps) => {
  const themeStyle = useTheme();
  const Background = mode === "gradient" ? ThemedGradient : View;

  return (
    <View style={[styles.container, style]}>
      <Background style={styles.gradient}>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.inner}>
            {text || typeof children === "string" ? (
              <Text style={[styles.text, themeStyle.text.primary]}>
                {text || children}
              </Text>
            ) : (
              children
            )}
          </View>
        </TouchableOpacity>
      </Background>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    overflow: "hidden",
  },
  inner: {},
  gradient: {
    paddingVertical: 9,
    paddingHorizontal: 24,
    justifyContent: "center",
    flexGrow: 1,
  },
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 11,
    lineHeight: 14,
  },
});
