import { StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "hooks";
import { observer } from "mobx-react-lite";

type ButtonProps = {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default observer(function ThemedGradient({
  children,
  style,
}: ButtonProps) {
  const themeStyle = useTheme();
  return (
    <LinearGradient
      colors={themeStyle.gradient_colors}
      style={[themeStyle.gradient_style, style]}
    >
      {children}
    </LinearGradient>
  );
});
