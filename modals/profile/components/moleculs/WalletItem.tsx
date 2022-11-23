import { useCallback, useEffect, useRef } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { COLOR, hexAlpha } from "utils";
import { Icon2 } from "components/atoms";
import { SwipeActions } from "../atoms";
import { ProfileWallets } from "stores/WalletStore";
import { firstAvailableWallet } from "core/utils/Coin";
import { CosmosWallet } from "core/storing/Wallet";

type Props = {
  value: ProfileWallets;
  onPress(value: ProfileWallets): void;
  onPressDelete(value: ProfileWallets): void;
  mapItemsRef: Map<ProfileWallets, React.RefObject<Swipeable>>;
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
  const { name } = value.profile;

  const ref = useRef<Swipeable>(null);

  useEffect(() => {
    mapItemsRef.set(value, ref);
  }, [value, ref]);

  const closeOther = useCallback(
    () =>
      mapItemsRef.forEach(
        async (ref, key) =>
          {
            const kw = firstAvailableWallet(key.wallets) as CosmosWallet
            const vw = firstAvailableWallet(value.wallets) as CosmosWallet
            return (await kw?.Address() !== await vw?.Address() && ref.current?.close())
          }
      ),
    [value, mapItemsRef]
  );

  const renderRightActions = () => (
    <SwipeActions
      edited={false}
      item={value}
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
      <View style={styles.wrapper}>
        <View style={[styles.container, style]}>
          <RectButton onPress={handlePress}>
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
          </RectButton>
        </View>
      </View>
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
