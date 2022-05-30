import { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { observer } from "mobx-react-lite";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useStore } from "hooks";
import { InputHandler } from "utils";
import { Search, Title } from "../atoms";
import { LanguageItem } from "../moleculs";

type Props = {
  close?(): void;
};

const languages = [
  { name: "123", value: "en", id: 1 },
  { name: "123", value: "en", id: 2 },
  { name: "123", value: "en", id: 3 },
  { name: "123", value: "en", id: 4 },
  { name: "123", value: "en", id: 5 },
  { name: "123", value: "en", id: 6 },
  { name: "123", value: "en", id: 7 },
  { name: "123", value: "en", id: 8 },
  { name: "123", value: "en", id: 9 },
  { name: "123", value: "en", id: 10 },
  { name: "123", value: "en", id: 11 },
  { name: "123", value: "en", id: 12 },
  { name: "123", value: "en", id: 13 },
  { name: "123", value: "en", id: 14 },
  { name: "123", value: "en", id: 15 },
  { name: "123", value: "en", id: 16 },
  { name: "123", value: "en", id: 17 },
  { name: "123", value: "en", id: 18 },
  { name: "123", value: "en", id: 19 },
  { name: "123", value: "en", id: 20 },
  { name: "123", value: "en", id: 21 },
  { name: "123", value: "en", id: 22 },
];

export default observer<Props>(({}) => {
  const { settings } = useStore();

  const input = useMemo(() => new InputHandler(), []);

  const filtred = useMemo(
    () =>
      input.value
        ? languages.filter(({ name }) => name.includes(input.value))
        : languages,
    [input.value]
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Seleziona Lingua</Title>
      <Search
        placeholder="Cerca Lingua"
        style={styles.search}
        value={input.value}
        onChangeText={input.set}
      />
      <BottomSheetScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {filtred.map((language, index) => (
          <LanguageItem
            key={index}
            value={language.name}
            isActive={language.value === settings.language}
            onPress={settings.setLenguage}
          />
        ))}
      </BottomSheetScrollView>
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
