import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Phrase } from "classes";
import { Button } from "components/atoms";
import { StyleSheet, Text, View } from "react-native";
import { Title } from "../../atoms";
import { Phrase as PhraseView } from "components/moleculs";
import { COLOR } from "utils";

type CreateStepProps = {
  isHidden: boolean;
  onPressToggle(): void;
  phrase: Phrase;
};

export default ({ isHidden, onPressToggle, phrase }: CreateStepProps) => {
  return (
    <>
      <Title style={styles.title}>Create new Mnemonics</Title>
      <Text style={styles.caption}>
        This is the only way you will be able to{"\n"}
        recover your account.Please store it {"\n"}
        somewhere safe!
      </Text>
      <View style={{ alignItems: "center" }}>
        <Button
          style={styles.button}
          onPress={onPressToggle}
          text={isHidden ? "Show" : "Hide"}
          contentContainerStyle={styles.buttonContainer}
        />
      </View>
      <BottomSheetScrollView
        style={{ flexGrow: 1 }}
        contentContainerStyle={{ paddingBottom: 116 }}
      >
        <PhraseView
          style={styles.phrase}
          hidden={isHidden}
          value={phrase.words}
        />
      </BottomSheetScrollView>
    </>
  );
};

const styles = StyleSheet.create({
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
    alignItems: "center",
  },

  button: {
    marginBottom: 25,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
