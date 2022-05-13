import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import ThemedGradient from "./ThemedGradient";
import { useTheme } from "hooks";
import { TouchableOpacity } from "react-native-gesture-handler";

type Mode = "gradient" | "fill";

type ButtonProps = {
  onPress?(): void;
  mode?: Mode;
  text?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  Left?: JSX.Element;
  Right?: JSX.Element;
};

export default ({
  onPress,
  text,
  children,
  style,
  mode = "gradient",
  contentContainerStyle,
  textStyle,
  Left,
  Right,
}: ButtonProps) => {
  const themeStyle = useTheme();
  const Background = mode === "gradient" ? ThemedGradient : View;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, style]}>
        <Background style={[styles.gradient, contentContainerStyle]}>
          {!!Left && Left}
          {text || typeof children === "string" ? (
            <Text style={[styles.text, themeStyle.text.primary, textStyle]}>
              {text || children}
            </Text>
          ) : (
            children
          )}
          {!!Right && Right}
        </Background>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    overflow: "hidden",
  },
  gradient: {
    paddingVertical: 9,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 11,
    lineHeight: 14,
  },
});
