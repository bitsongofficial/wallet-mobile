import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { SharedValue } from "react-native-reanimated";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "hooks";
import { COLOR, hexAlpha, InputHandler } from "utils";
import { Button, Icon2, Switch } from "components/atoms";
import { BottomSheet } from "components/moleculs";
import { ListButton, Search, Title } from "../atoms";
import { WalletItemEdited } from "../moleculs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useBottomSheetBackButton from "screens/Profile/hooks/useBottomSheetBackButton";
import { ProfileWallets } from "stores/WalletStore";

type Props = {
  isOpen?: boolean;
  animatedPosition?: SharedValue<number>;
  backgroundStyle: StyleProp<
    Omit<ViewStyle, "bottom" | "left" | "position" | "right" | "top">
  >;
  onClose?(): void;
};

export default observer<Props>(
  ({ animatedPosition, isOpen, onClose, backgroundStyle }) => {
    const { settings, wallet } = useStore();

    // ------ BottomSheet -------

    const snapPoints = useMemo(() => ["95%"], []);
    const bottomSheet = useRef<BottomSheetMethods>(null);

    const close = () => bottomSheet.current?.close();
    const open = () => bottomSheet.current?.snapToIndex(0);

    useEffect(() => (isOpen ? open() : close()), [isOpen]);

    // ------- Search -----------
    const inputSearch = useMemo(() => new InputHandler(), []);

    const filtred = useMemo(() => {
      if (inputSearch.value) {
        const lowerCase = inputSearch.value.toLowerCase();
        return wallet.wallets.filter(({ profile }) =>
          profile.name?.toLowerCase().includes(lowerCase)
        );
      } else {
        return wallet.wallets;
      }
    }, [inputSearch.value, wallet.wallets]);

    // ---------- Edit -----------
    const [edited, setEdited] = useState<ProfileWallets>(); // need store

    const inputWalletName = useMemo(
      () => new InputHandler(edited?.profile.name),
      [edited]
    );

    const removeEdited = useCallback(() => setEdited(undefined), []);

    const saveEdited = useCallback(
      () => { if(edited) edited.profile.name = inputWalletName.value },
      [edited, inputWalletName]
    );

    // ------- FlatList ----------

    const mapItemsRef = useMemo(
      () => observable.map<ProfileWallets, React.RefObject<Swipeable>>(),
      []
    );

    const [selectedWallet, setSelectedWallet] = useState(wallet.activeWallet);

    const keyExtractor = ({ profile }: ProfileWallets) => profile.name;
    const renderWallets = useCallback(
      ({ item }) => (
        <View style={{ marginBottom: 13 }}>
          <WalletItemEdited
            value={item}
            isActive={selectedWallet === item}
            onPress={setSelectedWallet}
            onPressDelete={wallet.deleteProfile}
            onPressEdit={setEdited}
            mapItemsRef={mapItemsRef}
          />
        </View>
      ),
      [selectedWallet]
    );

    // --------- Buttons ----------

    const insent = useSafeAreaInsets();

    const [isShowButton, setIsShowButton] = useState(false);
    const toggleButtonShow = useCallback((index: number) => {
      setIsShowButton(index >= 0);
    }, []);

    // -------- Done ---------

    const setWallet = useCallback(() => {
      wallet.changeActive(selectedWallet);
      close();
    }, [selectedWallet]);

    // --------- Close -----------

    const handleClose = useCallback(() => {
      onClose && onClose();
      removeEdited();
      mapItemsRef.forEach((ref) => ref.current?.close());
      setSelectedWallet(wallet.activeWallet);
    }, [onClose]);

    useBottomSheetBackButton(isOpen, handleClose);

    // console.log("isShowButton :>> ", isShowButton);
    return (
      <>
        <BottomSheet
          enablePanDownToClose
          snapPoints={snapPoints}
          ref={bottomSheet}
          backgroundStyle={backgroundStyle}
          animatedPosition={animatedPosition}
          onChange={toggleButtonShow}
          onClose={handleClose}
          index={-1}
        >
          <View style={styles.container}>
            {!edited ? (
              <>
                <View style={styles.wrapper}>
                  <View style={styles.header}>
                    <View style={styles.headerCenter}>
                      <Title style={styles.title}>Seleziona Wallet</Title>
                    </View>
                  </View>
                  <Search
                    placeholder="Cerca Wallet"
                    style={styles.search}
                    value={inputSearch.value}
                    onChangeText={inputSearch.set}
                  />
                </View>

                {/* <View style={[styles.switchContainer, styles.wrapper]}>
                  <Text style={styles.switchTitle}>Tutti</Text>
                  <Switch gradient />
                </View> */}

                <BottomSheetFlatList
                  data={filtred}
                  keyExtractor={keyExtractor}
                  renderItem={renderWallets}
                  style={styles.scroll}
                  contentContainerStyle={styles.scrollContent}
                />
              </>
            ) : (
              <View style={styles.wrapper}>
                <View style={styles.header}>
                  <View style={styles.headerLeft}>
                    <RectButton
                      style={styles.buttonBack}
                      onPress={removeEdited}
                    >
                      <Icon2 size={24} name="arrow_left" stroke={COLOR.White} />
                    </RectButton>
                  </View>

                  <View style={styles.headerCenter}>
                    <Title style={styles.title}>Edit Wallet</Title>
                  </View>
                  <View style={styles.headerRight} />
                </View>
                <Search
                  placeholder="Cerca Wallet"
                  style={styles.search}
                  value={inputWalletName.value}
                  onChangeText={inputWalletName.set}
                  loupe={false}
                />
                <View style={styles.editMenu}>
                  <Text style={styles.editTitle}>Safety</Text>
                  <View style={styles.buttons_list}>
                    <ListButton
                      style={styles.listButton}
                      icon="eye"
                      text="View Mnemonics"
                      arrow
                    />
                    <ListButton
                      style={styles.listButton}
                      icon="key"
                      text="Eliminate Mnemonics"
                      arrow
                    />
                    <ListButton
                      style={styles.listButton}
                      icon="power"
                      text="Disconnect Wallet"
                      arrow
                    />
                  </View>

                  <Text style={styles.caption}>
                    Access VIP experiences, exclusive previews,{"\n"}
                    finance your own and have your say.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </BottomSheet>
        {isShowButton && (
          <View style={[styles.buttons, { bottom: insent.bottom }]}>
            {!edited ? (
              <Button
                text="Select"
                onPress={setWallet}
                textStyle={styles.buttonText}
                contentContainerStyle={styles.buttonContent}
              />
            ) : (
              <Button
                text="Save"
                onPress={saveEdited}
                textStyle={styles.buttonText}
                contentContainerStyle={styles.buttonContent}
              />
            )}
          </View>
        )}
      </>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: Dimensions.get("screen").height * 0.9,
    marginTop: 15,
  },
  wrapper: { marginHorizontal: 26 },

  // ------ Header ---------
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  headerRight: { flex: 1 },
  headerCenter: {
    flex: 2,
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
  },

  buttonBack: { padding: 5 },
  title: { fontSize: 16 },
  search: { marginBottom: 9 },

  // ------  Edit --------

  editMenu: { marginTop: 40 },
  editTitle: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,

    color: hexAlpha(COLOR.White, 50),
  },

  buttons_list: {
    marginRight: 15,
    paddingTop: 15,
  },
  listButton: { marginBottom: 5 },

  caption: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,

    color: hexAlpha(COLOR.White, 30),
    textAlign: "center",

    marginTop: 40,
  },

  // ----- Wallets -------
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
    flexGrow: 1,
  },
  scrollContent: {
    paddingTop: 9,
    paddingBottom: 50,
  },

  // ------- Buttons ------

  buttons: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 18,
  },
  buttonContent: {
    paddingVertical: 18,
    paddingHorizontal: 40,
  },
});
