import { useCallback, useMemo, useState } from "react";
import {
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { CoinStat, Tabs } from "components/organisms";
import { useGlobalBottomsheet, useStore } from "hooks";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { observer } from "mobx-react-lite";
import { ToolbarFull, ToolbarShort } from "./components";
import SendModal from "screens/SendModalScreens/SendModal";
import { RootStackParamList, RootTabParamList } from "types";
import { COLOR } from "utils";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView } from "react-native-gesture-handler";
import ReceiveModal from "screens/SendModalScreens/ReceiveModal";

type ValueTabs = "Coins" | "Fan Tokens";

const tabs: ValueTabs[] = ["Coins"];

type Props = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList>,
  BottomTabScreenProps<RootTabParamList, "MainTab">
>;

export default observer<Props>(function MainScreen({ navigation }) {
  const { coin, dapp, settings } = useStore();
  // need culc by wallet

  const [activeTab, setActiveTab] = useState<ValueTabs>("Coins");

  const callback = useCallback(() => {}, []);

  // ------------- bottom sheet -----------
  const globalBottomsheet = useGlobalBottomsheet();

  const closeGlobalBottomSheet = useCallback(
    () => globalBottomsheet.close(),
    []
  );

  const openReceive = useCallback(() => {
    globalBottomsheet.setProps({
      snapPoints: ["85%"],
      children: (
        <ReceiveModal
          style={sendCoinContainerStyle}
          close={closeGlobalBottomSheet}
        />
      ),
    });
    globalBottomsheet.snapToIndex(0);
  }, []);

  const openToolbar = useCallback(() => {
    globalBottomsheet.setProps({
      snapPoints: ["70%"],
      children: (
        <ToolbarFull
          style={styles.toolbar_full}
          onPressSend={openSend}
          onPressReceive={openReceive}
          onPressInquire={callback}
          onPressScan={callback}
          onPressClaim={callback}
          onPressStake={callback}
          onPressUnstake={callback}
          onPressRestake={callback}
          onPressIssue={callback}
          onPressMint={callback}
          onPressBurn={callback}
        />
      ),
    });
    globalBottomsheet.expand();
  }, []);

  const openSend = useCallback(async () => {
    await globalBottomsheet.setProps({
      snapPoints: ["85%"],
      $modal: true,
      keyboardBehavior: "fillParent",
      children: (
        <SendModal
          style={sendCoinContainerStyle}
          close={closeGlobalBottomSheet}
          navigation={navigation}
        />
      ),
    });
    globalBottomsheet.expand();
  }, []);

  const openScanner = useCallback(
    () =>
      navigation.navigate("ScannerQR", {
        onBarCodeScanned: (uri) => {
          try {
            dapp.connect(uri);
          } catch (e) {
            console.log(e);
          }
        },
      }),
    []
  );

  const safeAreaInsets = useSafeAreaInsets();
  const sendCoinContainerStyle = useMemo(
    () => ({ paddingBottom: safeAreaInsets.bottom }),
    [safeAreaInsets.bottom]
  );

  const [isRefreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    console.log("teste refresh");
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <>
      <StatusBar style="light" />

      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollviewContent}
          refreshing={isRefreshing}
          refreshControl={
            <RefreshControl
              // colors={[COLOR.White]}
              tintColor={COLOR.White}
              refreshing={isRefreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View style={styles.info}>
            <View style={styles.balance}>
              <Text style={styles.balance_title}>Total Balance</Text>
              <Text style={styles.balance_value}>
                {coin.totalBalance.toLocaleString("en")} $
              </Text>
            </View>
          </View>

          <ToolbarShort
            style={styles.toolbar_short}
            onPressAll={openToolbar}
            onPressInquire={callback}
            onPressReceive={openReceive}
            onPressScan={openScanner}
            onPressSend={openSend}
          />

          <Tabs
            values={tabs}
            active={activeTab}
            // @ts-ignore TODO: create cool types
            onPress={setActiveTab}
            style={styles.tabs}
          />

          <View style={styles.coins}>
            {coin.coins
              .filter((c) => c.balance > 0)
              .map((coin) => (
                <TouchableOpacity key={coin.info._id} disabled={true}>
                  <CoinStat coin={coin} style={{ marginBottom: 9 }} />
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.Dark3,
  },

  scrollviewContent: {
    marginTop: 40,
    paddingTop: 40,
  },
  info: {
    marginRight: 22,
    marginLeft: 32,
    marginBottom: 60,
  },
  balance: {
    marginBottom: 34,
  },
  balance_title: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 18,
    lineHeight: 23,
    color: COLOR.RoyalBlue2,

    marginBottom: 10,
  },
  balance_value: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 42,
    lineHeight: 53,
    color: COLOR.White,

    marginBottom: 6,
  },
  balance_variation: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
    color: COLOR.White,
    opacity: 0.5,
  },

  reward: {},
  reward_title: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 20,
    color: COLOR.RoyalBlue2,
    marginBottom: 10,
  },
  reward_value: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 30,
    color: COLOR.White,
  },

  reward_row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  toolbar_short: {
    marginHorizontal: 24,
    marginBottom: 40,
  },
  toolbar_full: {
    padding: 24,
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },

  tabs: {
    paddingHorizontal: 30,
    marginBottom: 18,
  },
  coins: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 64,
    marginHorizontal: 14,
  },
});
