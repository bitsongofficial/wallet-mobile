import { useCallback, useMemo } from "react";
import {
  ListRenderItem,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  RectButton,
  Swipeable,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { observer } from "mobx-react-lite";
import { RootStackParamList } from "types";
import { useStore } from "hooks";
import { Button, Icon2, ThemedGradient } from "components/atoms";
import { COLOR, InputHandler } from "utils";
import { Circles, Search, Subtitle, Title } from "./components/atoms";
import { Wallet } from "classes";
import { observable } from "mobx";
import { WalletItem } from "./components/moleculs";

type Props = NativeStackScreenProps<RootStackParamList, "AddressBook">;

export default observer<Props>(function AddressBookScreen({ navigation }) {
  const { walletStore } = useStore();

  // ------- Wallets ------
  const wallets = walletStore.wallets;
  const mapItemsRef = useMemo(
    () => observable.map<Wallet, React.RefObject<Swipeable>>(),
    []
  );

  const renderWallet = useCallback<ListRenderItem<Wallet>>(
    ({ item }) => (
      <View style={{ marginBottom: 13 }}>
        <WalletItem
          value={item}
          onPress={() => {}}
          onPressDelete={walletStore.deleteWallet}
          // onPressEdit={setEdited}
          mapItemsRef={mapItemsRef}
        />
      </View>
    ),
    []
  );

  const goBack = useCallback(() => navigation.goBack(), []);

  const input = useMemo(() => new InputHandler(), []);

  return (
    <>
      <StatusBar style="light" />

      <ThemedGradient invert style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Header
            onPressBack={goBack}
            style={[styles.header, styles.wrapper]}
            title="Wallet Connect"
            onPressScan={() => {}}
          />
          <View style={[styles.wrapper, { flex: 1 }]}>
            <Search
              value={input.value}
              onChangeText={input.set}
              placeholder="Search Address"
              bottomsheet={false}
            />
            <View style={{ alignItems: "center" }}>
              <View style={{ marginVertical: 40 }}>
                <Circles>
                  <Icon2 name="address_book" size={69} stroke={COLOR.White} />
                </Circles>
              </View>
              <Title style={styles.title}>
                Non hai ancora aggiunto alcun contatto
              </Title>
              <Subtitle style={styles.subtitle}>
                Access VIP experiences, exclusive previews, finance your own
                music projects and have your say.
              </Subtitle>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                textStyle={styles.buttonText}
                contentContainerStyle={styles.buttonContent}
                mode="fill"
                text={"Scan QR Code"}
              />
            </View>
          </View>
        </SafeAreaView>
      </ThemedGradient>
    </>
  );
});

type PropsHeader = {
  onPressBack(): void;
  onPressScan(): void;
  style?: StyleProp<ViewStyle>;
  title?: string;
};

const Header = ({ onPressBack, style, title, onPressScan }: PropsHeader) => (
  <View style={[styles.header_container, style]}>
    <View style={styles.header_left}>
      <TouchableOpacity onPress={onPressBack} style={styles.header_backButton}>
        <Icon2 name="arrow_left" size={24} stroke={COLOR.White} />
      </TouchableOpacity>
      <Title style={{ marginLeft: 19, fontSize: 18 }}>{title}</Title>
    </View>
    <View style={styles.header_right}>
      <View style={styles.header_scanButtonContainer}>
        <RectButton style={styles.header_scanButton} onPress={onPressScan}>
          <Icon2 name="scan_1" size={18} stroke={COLOR.White} />
        </RectButton>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { marginBottom: 25 },

  head: {
    marginHorizontal: 25, // <- wrapper
    marginBottom: 30,
  },

  wrapper: { marginHorizontal: 34 },
  title: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 25,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 18,
    textAlign: "center",
    opacity: 0.3,
  },

  buttonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
    paddingVertical: 16,
  },
  buttonContent: {
    paddingHorizontal: 55,
    paddingVertical: 18,
    backgroundColor: COLOR.Dark3,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 18,
  },

  // ------- Header ----------
  header_container: { flexDirection: "row" },
  header_left: { flexDirection: "row" },
  header_backButton: {
    padding: 5,
    borderRadius: 20,
  },
  header_right: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  header_scanButtonContainer: {
    width: 33,
    height: 33,
    borderRadius: 33,
    backgroundColor: COLOR.Dark3,
    overflow: "hidden",
  },
  header_scanButton: {
    width: 33,
    height: 33,
    alignItems: "center",
    justifyContent: "center",
  },
});
