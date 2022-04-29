import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useCallback } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

type TabButtonProps = BottomTabBarProps & {
  route: any;
  index: number;
  onPress(route: any, isFocused: boolean): void;
  onLongPress(route: any): void;
};

export default ({
  state,
  descriptors,
  index,
  route,
  onPress,
  onLongPress,
}: TabButtonProps) => {
  const { options } = descriptors[route.key];

  const renderIcon = options.tabBarIcon;

  const isFocused = state.index === index;

  const handlePress = useCallback(
    () => onPress(route, isFocused),
    [onPress, isFocused]
  );

  const handleLongPress = useCallback(() => onLongPress(route), [onPress]);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={styles.touchable}
    >
      {renderIcon !== undefined && renderIcon({})}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});