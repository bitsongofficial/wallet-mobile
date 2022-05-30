import { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { observer } from "mobx-react-lite";
import { useStore } from "hooks";
import { InputHandler } from "utils";
import { Search, Title } from "../atoms";
import { CurrencyItem } from "../moleculs";

type Props = {
  close?(): void;
};

const currencies = [
  { name: "USD", title: "Dollaro statunitense", _id: 1 },
  { name: "EUR", title: "Euro", _id: 2 },
  { name: "JPY", title: "Yen giapponese", _id: 3 },
  { name: "GBP", title: "Sterlina inglese", _id: 4 },
  { name: "AUD", title: "Dollaro australiano", _id: 5 },
  { name: "CAD", title: "Dollaro canadese", _id: 6 },
  { name: "CHF", title: "Franco svizzero", _id: 7 },
  { name: "CNH", title: "Renminbi cinese", _id: 8 },
  { name: "SEK", title: "Corona svedese", _id: 9 },
  { name: "NZD", title: "Dollaro neozelandese", _id: 10 },
];

export default observer<Props>(({}) => {
  const { settings } = useStore();

  const input = useMemo(() => new InputHandler(), []);

  const filtred = useMemo(
    () =>
      input.value
        ? currencies.filter(({ name }) => name.includes(input.value))
        : currencies,
    [input.value]
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
      <BottomSheetScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {filtred.map((currency, index) => (
          <CurrencyItem
            value={currency}
            key={index}
            isActive={currency._id === settings.currency?._id}
            onPress={settings.setCurrency}
          />
        ))}
      </BottomSheetScrollView>
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

  scroll: {
    height: 100,
    flexGrow: 1,
  },
  scrollContent: {
    paddingTop: 9,
    paddingBottom: 50,
  },
});
