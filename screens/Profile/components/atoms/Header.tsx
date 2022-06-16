import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon2 } from "components/atoms";
import { COLOR, hexAlpha } from "utils";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  onPressClose(): void;
  style?: StyleProp<ViewStyle>;
  animtedValue: SharedValue<number>;
};

export default ({ onPressClose, style, animtedValue }: Props) => {
  const logoStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            animtedValue.value,
            [0, 32],
            [1, 0],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={logoStyle}>
        <Icon2 name="logo_black" size={40} />
      </Animated.View>
      <TouchableOpacity style={styles.button} onPress={onPressClose}>
        <Icon2 name="close" size={18} stroke={COLOR.White} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 55,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: hexAlpha(COLOR.White, 10),
    padding: 13,
    borderRadius: 35,
  },
});