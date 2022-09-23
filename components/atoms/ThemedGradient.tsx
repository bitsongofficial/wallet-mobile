import { StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "hooks";
import { observer } from "mobx-react-lite";

type Props = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  invert?: boolean;
};

export default observer(function ThemedGradient({
  children,
  style,
  invert,
}: Props) {
  const themeStyle = useTheme();

  const colors = invert
    ? [...themeStyle.gradient_colors].reverse()
    : themeStyle.gradient_colors;

  return (
    <LinearGradient colors={colors} style={[themeStyle.gradient_style, style]}>
      {children}
    </LinearGradient>
  );
});
