import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SharedValue } from "react-native-reanimated";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "hooks";
import { COLOR, hexAlpha, InputHandler } from "utils";
import { Switch } from "components/atoms";
import { BottomSheet } from "components/moleculs";
import { Search, Title } from "../atoms";
import { WalletItem } from "../moleculs";
import { Wallet } from "classes";

type Props = {
  isOpen?: boolean;
  animatedPosition?: SharedValue<number>;
  backgroundStyle: StyleProp<
    Omit<ViewStyle, "bottom" | "left" | "position" | "right" | "top">
  >;
  onClose?(): void;
};

export default observer<Props>(({ animatedPosition, isOpen, onClose }) => {
  const { settings, walletStore } = useStore();

  // ------ BottomSheet -------
  const snapPoints = useMemo(() => ["95%"], []);

  const bottomSheet = useRef<BottomSheetMethods>(null);

  const close = () => bottomSheet.current?.close();
  const open = () => bottomSheet.current?.snapToIndex(0);

  useEffect(() => (isOpen ? open() : close()), [isOpen]);

  // ------- Search -----------
  const input = useMemo(() => new InputHandler(), []);

  const filtred = useMemo(() => {
    if (input.value) {
      const lowerCase = input.value.toLowerCase();
      return walletStore.wallets.filter(({ info }) =>
        info.name.toLowerCase().includes(lowerCase)
      );
    } else {
      return walletStore.wallets;
    }
  }, [input.value, walletStore.wallets]);

  // ------- FlatList ----------

  const [edited, setEdited] = useState<Wallet>(); // need store

  const keyExtractor = ({ info }: Wallet) => info.address;
  const renderWallets = useCallback(
    ({ item }) => (
      <View style={{ marginBottom: 13 }}>
        <WalletItem
          value={item}
          isActive={walletStore.active === item}
          onPress={walletStore.setActive}
          onPressDelete={walletStore.deleteWallet}
          onPressEdit={setEdited}
          mapItemsRef={mapItemsRef}
        />
      </View>
    ),
    [walletStore.active]
  );

  useEffect(() => () => setEdited(undefined), []);

  // ------- Swipe -------------
  const mapItemsRef = useMemo(
    () => observable.map<Wallet, React.RefObject<Swipeable>>(),
    []
  );

  // ---------------------------

  return (
    <>
      <BottomSheet
        enablePanDownToClose
        snapPoints={snapPoints}
        ref={bottomSheet}
        backgroundStyle={styles.bottomSheetBackground}
        animatedPosition={animatedPosition}
        onClose={onClose}
        index={-1}
      >
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <View style={styles.header}>
              <Title style={styles.title}>Seleziona Wallet</Title>
            </View>
            <Search
              placeholder="Cerca Wallet"
              style={styles.search}
              value={input.value}
              onChangeText={input.set}
            />

            <View style={styles.switchContainer}>
              <Text style={styles.switchTitle}>Tutti</Text>
              <Switch gradient />
            </View>
          </View>

          <BottomSheetFlatList
            style={styles.scroll}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.scrollContent}
            data={filtred}
            renderItem={renderWallets}
          />

          <Text>
            Access VIP experiences, exclusive previews, finance your own and
            have your say.
          </Text>
        </View>
      </BottomSheet>
      {/* <Button></Button> */}
    </>
  );
});

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: COLOR.Dark3,
    paddingTop: 30,
  },
  container: {
    flexGrow: 1,
    height: Dimensions.get("screen").height * 0.9,
  },

  wrapper: { marginHorizontal: 26 },

  fakeSearch: {
    backgroundColor: hexAlpha(COLOR.Lavender, 10),
    borderRadius: 20,
    height: 62,
    flexDirection: "row",
    paddingLeft: 25,
  },

  header: {},
  title: {
    fontSize: 16,
    lineHeight: 20,

    marginBottom: 30,
  },
  search: {
    marginBottom: 9,
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",

    marginTop: 32,
    marginBottom: 9,
  },
  switchTitle: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 15,

    color: COLOR.White,
    marginRight: 11,
  },

  scroll: {
    height: 100,
    flexGrow: 1,
  },
  scrollContent: {
    paddingTop: 9,
    paddingBottom: 50,
  },
});
