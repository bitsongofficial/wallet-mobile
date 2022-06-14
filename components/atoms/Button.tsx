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

type Mode = "gradient" | "fill" | "gradient_border";

type ButtonProps = {
  onPress?(): void;
  mode?: Mode;
  text?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disable?: boolean;
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
  disable,
  Left,
  Right,
}: ButtonProps) => {
  const themeStyle = useTheme();
  const Background =
    mode === "gradient" || mode === "gradient_border" ? ThemedGradient : View;

  return (
    <TouchableOpacity onPress={!disable ? onPress : undefined}>
      <View style={[styles.container, style, disable && styles.disable]}>
        <Background style={mode === "gradient_border" && styles.border}>
          <View style={[styles.content, contentContainerStyle]}>
            {!!Left && Left}
            {text || typeof children === "string" ? (
              <Text style={[styles.text, themeStyle.text.primary, textStyle]}>
                {text || children}
              </Text>
            ) : (
              children
            )}
            {!!Right && Right}
          </View>
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
  content: {
    paddingVertical: 9,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 50,
    // backgroundColor: "red",
  },
  border: {
    padding: 2,
  },
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 11,
    lineHeight: 14,
  },
  disable: {
    opacity: 0.5,
  },
});
