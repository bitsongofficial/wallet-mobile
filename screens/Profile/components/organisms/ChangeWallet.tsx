import { useCallback, useMemo, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "hooks";
import { COLOR, hexAlpha, InputHandler } from "utils";
import { Button, Icon2 } from "components/atoms";
import { ListButton, Search, Title } from "../atoms";
import { WalletItemEdited } from "../moleculs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProfileWallets } from "stores/WalletStore";

type Props = {
  close(): void;
};

export default observer<Props>(({ close }) => {
  const { settings, wallet } = useStore();
  const insent = useSafeAreaInsets();

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
  const saveEdited = useCallback(() => {
    if (edited) edited.profile.name = inputWalletName.value;
    close()
  }, [edited, inputWalletName]);

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

  // -------- Done ---------

  const setWallet = useCallback(() => {
    wallet.changeActive(selectedWallet);
    close();
  }, [selectedWallet]);

  return (
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
              <RectButton style={styles.buttonBack} onPress={removeEdited}>
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
                onPress={async () => (console.log(await wallet.activeWallet?.wallets.btsg.Mnemonic()))}
              />
              {/* <ListButton
                style={styles.listButton}
                icon="key"
                text="Eliminate Mnemonics"
                arrow
              /> */}
              <ListButton
                style={styles.listButton}
                icon="power"
                text="Disconnect Wallet"
                arrow
                onPress={() => wallet.deleteProfile(edited)}
              />
            </View>

            <Text style={styles.caption}>
              Access VIP experiences, exclusive previews,{"\n"}
              finance your own and have your say.
            </Text>
          </View>
        </View>
      )}

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
    </View>
  );
});

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
