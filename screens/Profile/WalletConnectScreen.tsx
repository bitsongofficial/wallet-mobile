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
  FlatList,
  RectButton,
  Swipeable,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { observer } from "mobx-react-lite";
import { RootStackParamList } from "types";
import { useStore } from "hooks";
import { Button, Icon2, ThemedGradient } from "components/atoms";
// import { Header } from "./components/atoms";
import { COLOR } from "utils";
import { Circles, Subtitle, Title } from "./components/atoms";
import { observable } from "mobx";
import { WalletItem } from "./components/moleculs";
import { ProfileWallets } from "stores/WalletStore";
import { SwipeableItem } from "components/organisms";
import { WalletConnectCosmosClientV1 } from "core/connection/WalletConnectV1";

type Props = NativeStackScreenProps<RootStackParamList, "WalletConnect">;

export default observer<Props>(function WalletConnect({ navigation }) {
  const { dapp } = useStore();

  // ------- Wallets ------
  const connections = dapp.connections;
  const mapItemsRef = useMemo(
    () => observable.map<string, React.RefObject<Swipeable>>(),
    []
  );

  const renderWallet = useCallback<ListRenderItem<WalletConnectCosmosClientV1>>(
    ({ item, index }) => item && item.connector ? (
      <View key={item.connector.session.key} style={{ marginBottom: 13 }}>
        <SwipeableItem
          id={item.connector.session.key} // need a unique key
          date={item.date ? item.date.toLocaleString() : ""}
          mapItemsRef={mapItemsRef} // for this
          onPressDelete={() => dapp.disconnect(item)} // and that
          name={item.name ?? "Unknown"}
          onPress={() => {}}
        />
      </View>
    ) : (null),
    []
  );

  const navToScanner = useCallback(
    () => navigation.push("ScannerQR", { onBarCodeScanned(data) {
      dapp.connect(data)
    } }),
    []
  );

  const navToScanner = useCallback(
    () => navigation.push("ScannerQR", { onBarCodeScanned(data) {} }),
    []
  );

  const goBack = useCallback(() => navigation.goBack(), []);

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
          {connections.length > 0 && (
            <>
              <Subtitle style={[{ marginBottom: 23 }, styles.wrapper]}>
                Connessioni attive
              </Subtitle>
              <FlatList data={connections} renderItem={renderWallet} />
            </>
          )}
          <View style={[styles.wrapper, { flex: 1 }]}>
            {connections.length === 0 && (
              <View style={{ alignItems: "center" }}>
                <View style={{ marginVertical: 40 }}>
                  <Circles>
                    <Icon2 name="qr_code" size={70} stroke={COLOR.White} />
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
            )}
            <View style={styles.buttonContainer}>
              <Button
                onPress={navToScanner}
                textStyle={styles.buttonText}
                contentContainerStyle={styles.buttonContent}
                mode="fill"
                text="Scan QR Code"
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
          <Icon2 name="scan_2" size={20} stroke={COLOR.White} />
        </RectButton>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    marginBottom: 25,
  },

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

  button: {},
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
