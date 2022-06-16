import { useCallback, useEffect, useRef } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { COLOR, hexAlpha } from "utils";
import { Icon2, IconName, ThemedGradient } from "components/atoms";
import { SwipeActions } from "../atoms";
import { StoreWallet } from "stores/WalletStore";

type Props = {
  value: StoreWallet;
  onPress(value: StoreWallet): void;
  onPressEdit?(value: StoreWallet): void;
  onPressDelete(value: StoreWallet): void;
  isActive?: boolean;
  mapItemsRef: Map<StoreWallet, React.RefObject<Swipeable>>;
  style?: StyleProp<ViewStyle>;
};

export default ({
  value,
  isActive,
  onPress,
  onPressDelete,
  onPressEdit,
  mapItemsRef,
  style,
}: Props) => {
  const handlePress = useCallback(() => onPress(value), [onPress, value]);
  const { name, metadata } = value.data;

  const iconName: IconName = metadata.type === "one" ? "wallet" : "eye";

  const ref = useRef<Swipeable>(null);

  useEffect(() => {
    mapItemsRef.set(value, ref);
  }, [value, ref]);

  const closeOther = useCallback(
    () =>
      mapItemsRef.forEach(
        (ref, key) =>
          key.data.metadata.address !== value.data.metadata.address && ref.current?.close()
      ),
    [value, mapItemsRef]
  );

  const renderRightActions = () => (
    <SwipeActions
      wallet={value}
      onPressEdit={onPressEdit}
      onPressTrash={onPressDelete}
      style={styles.actions}
    />
  );

  const Inner = () => (
    <View style={styles.inner}>
      <Text style={[styles.name, isActive && styles.name_active]}>{name}</Text>
      <Icon2 size={18} name={iconName} stroke={COLOR.White} />
    </View>
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
            {isActive ? (
              <ThemedGradient style={styles.active}>
                <Inner />
              </ThemedGradient>
            ) : (
              <View style={styles.not_active}>
                <Inner />
              </View>
            )}
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
    backgroundColor: hexAlpha(COLOR.Lavender, 10),
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
    paddingHorizontal: 25,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLOR.Dark3,
    borderRadius: 20,
  },

  name: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 13,
    lineHeight: 50,
    color: hexAlpha(COLOR.White, 30),
  },

  name_active: {
    color: COLOR.White,
  },

  actions: { marginRight: 26 },
  wrapper: { paddingHorizontal: 26 },
});