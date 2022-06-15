import { useEffect, useMemo } from "react";
import { ImageStyle } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = {
  size?: number;
  style?: ImageStyle;
};

export default ({ size = 32 }: Props) => {
  const sizeStyle = useMemo<ImageStyle>(
    () => ({ width: size, height: size, borderRadius: size }),
    [size]
  );

  const rotation = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(
    () => ({
      transform: [{ rotateZ: `${rotation.value}deg` }],
    }),
    []
  );

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1800,
        easing: Easing.linear,
      }),
      -1
    );
    return () => cancelAnimation(rotation);
  }, []);

  return (
    <Animated.Image
      width={size}
      height={size}
      style={[sizeStyle, animatedStyles]}
      source={require("assets/images/spinner-loader.png")}
    />
  );
};
