import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import useTheme from "hooks/useTheme";
import TabButton from "./TabButton";

export default function MyTabBar(props: BottomTabBarProps) {
  const { navigation } = props;
  const themeStyle = useTheme();

  const onPress = (route: any, isFocused: boolean) => {
    const event = navigation.emit({
      canPreventDefault: true, // ?
      type: "tabPress",
      target: route.key,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const onLongPress = (route: any) =>
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });

  return (
    <View style={styles.container}>
      <LinearGradient
        style={[styles.gradient, themeStyle.gradient_style]}
        colors={themeStyle.gradient_colors}
      >
        {props.state.routes.map((route, index) => (
          <TabButton
            key={index}
            {...props}
            route={route}
            index={index}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        ))}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
    top: 0,
    bottom: 160,
  },
  container: {
    position: "absolute",
    height: 56,
    bottom: 34,
    left: 0,
    right: 0,
    marginHorizontal: 64,
    borderRadius: 50,
    overflow: "hidden",
  },
  gradient: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flex: 1,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
