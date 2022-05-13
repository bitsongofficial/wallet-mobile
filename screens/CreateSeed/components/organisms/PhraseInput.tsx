import { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { observer } from "mobx-react-lite";
import { COLOR } from "utils";
import { Phrase } from "classes";
import { Input, Word } from "components/atoms";

type Props = { phrase: Phrase };

export default observer(({ phrase }: Props) => {
  const scrollview = useRef<ScrollView>(null);

  useEffect(() => {
    const lastLenght = phrase.words.length;

    return () => {
      if (lastLenght < phrase.words.length) {
        scrollview.current?.scrollToEnd(); // TODO: fix for full end
      }
    };
  }, [phrase.words.length]);

  return (
    <>
      <View>
        {!!phrase.words.length && (
          <ScrollView
            horizontal
            ref={scrollview}
            style={styles.scrollview}
            contentContainerStyle={styles.scrollviewContent}
          >
            {phrase.words.map((word, index) => (
              <Word
                text={word}
                style={styles.word}
                index={index + 1}
                key={index}
              />
            ))}
          </ScrollView>
        )}
        <View style={styles.inputContainer}>
          <Text style={styles.text}>Word #{phrase.words.length + 1}</Text>
          <Input
            blurOnSubmit={false}
            value={phrase.inputValue}
            onChangeText={phrase.inputSet}
            onSubmitEditing={phrase.inputSubmit}
            keyboardAppearance="dark" // TODO: theme me
            autocomplite={phrase.hint}
          />
        </View>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  paste: {
    width: 65,
    marginHorizontal: 30,
    marginTop: 24,
    marginBottom: 40,
  },

  scrollview: {
    paddingVertical: 5,
    marginBottom: 35,
  },
  scrollviewContent: {
    paddingHorizontal: 30,
    height: 50,
  },

  word: { marginRight: 10 },
  inputContainer: { marginHorizontal: 30 },

  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 15,
    color: COLOR.Marengo,
    marginBottom: 12,
  },
});