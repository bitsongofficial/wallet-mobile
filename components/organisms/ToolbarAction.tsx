import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import useTheme from "hooks/useTheme";
import { hexAlpha } from "utils";

type Mode = "gradient" | "fill";

type Props = {
  onPress?(): void;
  Icon?: JSX.Element;
  title?: string;
  size?: number;
  mode?: Mode;

  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  iconContainerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<ViewStyle>;
};

export default memo(
  ({
    Icon,
    onPress,
    title,
    size = 52,
    mode = "fill",

    style,
    buttonStyle,
    textStyle,
    iconContainerStyle,
  }: Props) => {
    const themeStyle = useTheme();
    const sizeStyle: ViewStyle = {
      width: size,
      height: size,
    };
    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity onPress={onPress}>
          <View style={[styles.button, sizeStyle, buttonStyle]}>
            <LinearGradient
              // Button Linear Gradient
              style={[
                styles.gradient,
                themeStyle.gradient_style,
                mode === "fill" && {
                  backgroundColor: hexAlpha("#FFFFFF", 10),
                },
              ]}
              colors={mode === "gradient" ? themeStyle.gradient_colors : []}
            >
              <View style={[styles.gradient_inner, iconContainerStyle]}>
                {Icon}
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginBottom: 16,
    borderRadius: 50,
    overflow: "hidden",
  },
  gradient: {
    width: "100%",
    height: "100%",
    padding: 2,
  },
  gradient_inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 13,
    lineHeight: 16,
    color: "#FFFFFF",
  },
});
