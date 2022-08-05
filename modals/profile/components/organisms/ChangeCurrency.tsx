import { useCallback, useMemo } from "react";
import { Dimensions, ListRenderItem, StyleSheet, View } from "react-native";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { observer } from "mobx-react-lite";
import { useStore } from "hooks";
import { InputHandler } from "utils";
import { Search, Title } from "../atoms";
import { CurrencyItem } from "../moleculs";
import currencies from "constants/currencies";
import { ICurrency } from "screens/Profile/type";

type Props = {
  close(): void;
};

export default observer<Props>(({ close }) => {
  const { settings } = useStore();
  // --------- Search ---------

  const input = useMemo(() => new InputHandler(), []);

  const filtred = useMemo(() => {
    if (input.value) {
      const lowerCase = input.value.toLowerCase();
      return currencies.filter(({ name }) =>
        name.toLowerCase().includes(lowerCase)
      );
    } else {
      return currencies;
    }
  }, [input.value]);

  // ------- FlatList ----------

  const setCurrency = useCallback((currency: ICurrency) => {
    settings.setCurrency(currency);
    close();
  }, []);

  const keyExtractor = ({ _id }: ICurrency) => _id;
  const renderCurrencies = useCallback<ListRenderItem<ICurrency>>(
    ({ item }) => (
      <CurrencyItem
        value={item}
        key={item._id}
        isActive={settings.currency?._id === item._id}
        onPress={setCurrency}
      />
    ),
    [settings.currency]
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Seleziona Valuta</Title>
      <Search
        placeholder="Cerca Valuta"
        value={input.value}
        onChangeText={input.set}
        style={styles.search}
      />
      <BottomSheetFlatList
        data={filtred}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyExtractor={keyExtractor}
        renderItem={renderCurrencies}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: Dimensions.get("screen").height * 0.9,
    marginTop: 15,
    marginHorizontal: 26,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,

    marginBottom: 30,
    textAlign: "center",
  },
  search: {
    marginBottom: 9,
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