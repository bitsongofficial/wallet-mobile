import { useCallback, useEffect, useRef } from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { COLOR, hexAlpha } from "utils";
import { SwipeActions } from "../atoms";
import { Icon2 } from "components/atoms";
import { Contact } from "stores/ContactsStore";

type Props = {
  value: Contact;
  onPress(person: Contact): void;
  onPressStar(person: Contact): void;
  onPressEdit?(person: Contact): void;
  onPressDelete(person: Contact): void;
  mapItemsRef: Map<Contact, React.RefObject<Swipeable>>;
  style?: StyleProp<ViewStyle>;
};

export default ({
  value,
  onPress,
  onPressDelete,
  onPressEdit,
  onPressStar,
  mapItemsRef,
  style,
}: Props) => {
  const handlePress = useCallback(() => onPress(value), [onPress, value]);
  // const { name, metadata } = value.data;

  // const iconName: IconName = metadata.type === "one" ? "wallet" : "eye";

  const ref = useRef<Swipeable>(null);

  useEffect(() => {
    mapItemsRef.set(value, ref);
  }, [value, ref]);

  const closeOther = useCallback(
    () =>
      mapItemsRef.forEach(
        (ref, key) => key.address !== value.address && ref.current?.close()
      ),
    [value, mapItemsRef]
  );

  const renderRightActions = () => (
    <SwipeActions
      item={value}
      onPressEdit={onPressEdit}
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
        <RectButton onPress={handlePress} style={styles.buttonContainer}>
          <View style={[styles.container, style]}>
            <Image source={{ uri: value.avatar }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{value.name}</Text>
              <Text style={styles.wallet}>{value.address}</Text>
            </View>
            <RectButton style={styles.buttonStar} onPress={() => (onPressStar(value))}>
              <Icon2 name="star" size={20} stroke={hexAlpha(COLOR.White, 30)} fill={value.starred ? hexAlpha(COLOR.White, 30) : undefined} />
            </RectButton>
          </View>
        </RectButton>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderRadius: 22,
    backgroundColor: hexAlpha(COLOR.Lavender, 16),
    paddingVertical: 22,
    paddingHorizontal: 24,

    flexDirection: "row",
  },
  active: {
    padding: 2,
    borderRadius: 20,
    justifyContent: "center",
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 32,

    marginRight: 16,
  },

  name: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
    color: COLOR.White,
  },
  wallet: {
    //
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 15,
    color: hexAlpha(COLOR.White, 60),
  },

  buttonContainer: {
    borderRadius: 22,
  },
  buttonStar: {
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },

  actions: { marginRight: 26 },
  wrapper: {
    paddingHorizontal: 26,
  },
});