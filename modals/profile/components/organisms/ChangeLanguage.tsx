import { useCallback, useMemo } from "react";
import { Dimensions, ListRenderItem, StyleSheet, View } from "react-native";
import { observer } from "mobx-react-lite";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useStore } from "hooks";
import { InputHandler } from "utils";
import { Search, Title } from "../atoms";
import { LanguageItem } from "../moleculs";
import languages from "constants/languages";
import { ILang } from "screens/Profile/type";

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
      return languages.filter(({ name }) =>
        name.toLowerCase().includes(lowerCase)
      );
    } else {
      return languages;
    }
  }, [input.value]);

  // ------- FlatList ----------

  const setLanguage = useCallback((lang: ILang) => {
    settings.setLanguage(lang);
    close();
  }, []);

  const keyExtractor = ({ id }: ILang) => id;
  const renderLanguage = useCallback<ListRenderItem<ILang>>(
    ({ item }) => (
      <LanguageItem
        value={item}
        isActive={item.id === settings.language.id}
        onPress={setLanguage}
      />
    ),
    [settings.language]
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
      <BottomSheetFlatList
        data={filtred}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyExtractor={keyExtractor}
        renderItem={renderLanguage}
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
