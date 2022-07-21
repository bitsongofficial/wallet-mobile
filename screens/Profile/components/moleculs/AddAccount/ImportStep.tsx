import { StyleSheet, Text, View } from "react-native";
import { observer } from "mobx-react-lite";
import { Phrase } from "classes";
import { COLOR } from "utils";
import { Button } from "components/atoms";
import { PhraseHorisontal } from "components/moleculs";
import { Title } from "../../atoms";
import { useStore } from "hooks";

type CreateStepProps = {
  onPressPaste(): void;
  phrase: Phrase;
};

export default observer(({ phrase, onPressPaste }: CreateStepProps) => {
  return (
    <>
      <View style={styles.wrapper}>
        <Title style={styles.title}>Import Mnemonics</Title>
        <Text style={styles.caption}>
          This is the only way you will be able to{"\n"}
          recover your account.Please store it {"\n"}
          somewhere safe!
        </Text>
      </View>
      {phrase.words.length > 0 ? (
        <PhraseHorisontal
          phrase={phrase}
          contentContainerStyle={styles.phrase}
        />
      ) : (
        <View style={{ alignItems: "center" }}>
          <Button
            text="Paste"
            onPress={onPressPaste}
            textStyle={styles.buttonText}
            contentContainerStyle={styles.buttonContent}
          />
        </View>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 15,
    marginHorizontal: 26,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",

    marginBottom: 30,
  },
  caption: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,

    textAlign: "center",
    color: COLOR.Marengo,
    marginBottom: 26,
  },
  phrase: {
    paddingHorizontal: 26,
  },
  buttonText: {
    fontSize: 12,
  },
  buttonContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
