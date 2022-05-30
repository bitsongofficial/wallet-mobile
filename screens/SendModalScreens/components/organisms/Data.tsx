import { useCallback, useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useTheme } from "hooks";
import { COLOR } from "utils";

type Props = {
  json: string;
  style?: StyleProp<ViewStyle>;
};

type Layout = {
  width: number;
  height: number;
};

export default function CardData({ json, style }: Props) {
  const theme = useTheme();
  // https://stackoverflow.com/a/57839837

  const translationY = useSharedValue(0);
  const translationX = useSharedValue(0);
  const isScrolling = useSharedValue(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: ({ contentOffset }) => {
      translationY.value = contentOffset.y * 0.8;
      translationX.value = contentOffset.x * 0.8;
    },
    onBeginDrag: () => {
      isScrolling.value = true;
    },
    onEndDrag: () => {
      isScrolling.value = false;
    },
  });

  const [layoutVisible, setLayoutVisible] = useState<Layout>();
  const [layoutWhole, setLayoutWhole] = useState<Layout>();
  const getLayoutVisible = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) =>
      setLayoutVisible(layout),
    []
  );
  const getLayoutWhole = useCallback(
    (width, height) => setLayoutWhole({ width, height }),
    []
  );

  const visibleHeight = layoutVisible?.height || 1;
  const wholeHeight = layoutWhole?.height || 1;

  const indicatorSize = useMemo(
    () =>
      wholeHeight > visibleHeight
        ? (visibleHeight * visibleHeight) / (wholeHeight * 2)
        : visibleHeight,
    [visibleHeight]
  );

  const animStyleY = useAnimatedStyle(() => ({
    height: indicatorSize,
    transform: [{ translateY: translationY.value }],
  }));

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onContentSizeChange={getLayoutWhole}
          onLayout={getLayoutVisible}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          <Text style={[styles.text, theme.text.primary]}>{json}</Text>
        </Animated.ScrollView>
        <Animated.View style={[styles.indicatorY, animStyleY]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.Dark3,
    paddingVertical: 22,
    paddingHorizontal: 26,
    borderRadius: 20,
    overflow: "hidden",
    flex: 1,
  },
  row: { flexDirection: "row" },
  indicatorY: {
    width: 5,
    borderRadius: 5,
    backgroundColor: COLOR.White,
    opacity: 0.2,
  },
  indicatorX: {
    height: 5,
    borderRadius: 5,
    backgroundColor: COLOR.White,
    opacity: 0.2,
  },
  text: {
    fontFamily: "Courier Prime",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 16,
  },
});
