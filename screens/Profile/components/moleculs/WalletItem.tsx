import { useCallback, useEffect, useRef } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { COLOR, hexAlpha } from "utils";
import { Icon2 } from "components/atoms";
import { Wallet } from "classes";
import { SwipeActions } from "../atoms";

type Props = {
  value: Wallet;
  onPress(value: Wallet): void;
  onPressDelete(value: Wallet): void;
  mapItemsRef: Map<Wallet, React.RefObject<Swipeable>>;
  style?: StyleProp<ViewStyle>;
};

export default ({
  value,
  onPress,
  onPressDelete,
  mapItemsRef,
  style,
}: Props) => {
  const handlePress = useCallback(() => onPress(value), [onPress, value]);
  const { name } = value.info;

  const ref = useRef<Swipeable>(null);

  useEffect(() => {
    mapItemsRef.set(value, ref);
  }, [value, ref]);

  const closeOther = useCallback(
    () =>
      mapItemsRef.forEach(
        (ref, key) =>
          key.info.address !== value.info.address && ref.current?.close()
      ),
    [value, mapItemsRef]
  );

  const renderRightActions = () => (
    <SwipeActions
      edited={false}
      wallet={value}
      onPressTrash={onPressDelete}
      style={styles.actions}
    />
  );

  return (
    <Swipeable
      ref={ref}
      onSwipeableRightWillOpen={closeOther}
      renderRightActions={renderRightActions}
    >
      <RectButton onPress={handlePress}>
        <View style={styles.wrapper}>
          <View style={[styles.container, style]}>
            <View style={styles.inner}>
              <Icon2
                name="link_simple_horizontal"
                size={24}
                style={styles.icon}
              />
              <View style={styles.text}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.date}>Apr 12, 10:34 AM</Text>
              </View>
            </View>
          </View>
        </View>
      </RectButton>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 22,
    // backgroundColor: hexAlpha(COLOR.Lavender, 10),
  },
  active: {
    padding: 2,
    borderRadius: 20,
    justifyContent: "center",
  },
  not_active: {
    padding: 1,
    borderRadius: 20,
    justifyContent: "center",
  },

  inner: {
    height: 65,
    paddingHorizontal: 21,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#5a6de5",
    borderRadius: 20,
  },

  icon: {
    marginRight: 14,
  },

  text: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },

  name: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 15,
    lineHeight: 19,
    color: COLOR.White,
  },

  date: {
    // Apr 12, 10:34 AM
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 15,

    color: hexAlpha(COLOR.White, 50),
  },

  name_active: {
    color: COLOR.White,
  },

  actions: { marginRight: 26, width: 50 },
  wrapper: { paddingHorizontal: 26 },
});
