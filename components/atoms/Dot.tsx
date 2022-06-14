import { useSpring, animated } from "@react-spring/native";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { COLOR } from "utils";

type DotProps = {
  active: boolean;
  style?: StyleProp<ViewStyle>;
};

export default ({ active, style }: DotProps) => {
  const isActive = useSpring({
    width: active ? 19 : 8,
    backgroundColor: active ? COLOR.White : COLOR.Marengo,
  });

  return (
    <animated.View style={[styles.view, isActive, style]}>
      <></>
    </animated.View>
  );
};

const styles = StyleSheet.create({
  view: {
    height: 8,
    borderRadius: 30,
  },
});
