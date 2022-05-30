import { useMemo } from "react";
import { Swipeable } from "react-native-gesture-handler";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import { useStore } from "hooks";
import { COLOR, InputHandler } from "utils";
import { Switch } from "components/atoms";
import { Search, Title } from "../atoms";
import { WalletItem } from "../moleculs";
import { Wallet } from "../../type";

type Props = {
  close?(): void;
};

const wallets: Wallet[] = [
  {
    name: "Gianni Wallet",
    address: "1",
    type: "one",
  },
  {
    name: "Airdrop Fund Wallet",
    address: "2",
    type: "one",
  },
  {
    name: "Cold Wallet",
    address: "3",
    type: "two",
  },
];

export default observer<Props>(({}) => {
  const { settings } = useStore();

  const input = useMemo(() => new InputHandler(), []);

  const filtred = useMemo(() => {
    if (input.value) {
      const lowerCase = input.value.toLowerCase();
      wallets.filter(({ name }) => name.toLowerCase().includes(lowerCase));
    } else {
      return wallets;
    }
  }, [input.value]);

  const mapItemsRef = useMemo(
    () => observable.map<Wallet, React.RefObject<Swipeable>>(),
    []
  );

  return (
    <View style={styles.container}>
      <View style={{ marginHorizontal: 26 }}>
        <Title style={styles.title}>Seleziona Wallet</Title>
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
        keyExtractor={({ address }) => address}
        contentContainerStyle={styles.scrollContent}
        data={filtred}
        renderItem={({ item }) => (
          <View
            style={{
              // marginHorizontal: 26,
              marginBottom: 13,
            }}
          >
            <WalletItem
              value={item}
              onPress={() => {}}
              mapItemsRef={mapItemsRef}
              isActive
            />
          </View>
        )}
      />
      <View />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: Dimensions.get("screen").height * 0.9,
  },
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
