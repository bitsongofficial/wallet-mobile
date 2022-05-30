import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Phrase } from "classes";
import { Phrase as PhraseView } from "components/moleculs";
import { ButtonToggle } from "../moleculs";

type Props = {
  isHidden: boolean;
  onPressToggle(): void;
  phrase: Phrase;
};

export default ({ isHidden, phrase, onPressToggle }: Props) => (
  <>
    <View style={styles.toggle}>
      <ButtonToggle isHidden={isHidden} onPress={onPressToggle} />
    </View>
    <ScrollView
      style={styles.scrollview}
      contentContainerStyle={styles.scrollviewContainer}
    >
      <PhraseView hidden={isHidden} value={phrase.words} />
    </ScrollView>
  </>
);

const styles = StyleSheet.create({
  toggle: {
    marginTop: 24,
    width: 173,
  },
  scrollview: {
    flex: 1,
    marginTop: 16,
    marginBottom: 16,
  },
  scrollviewContainer: {
    paddingTop: 15,
    paddingBottom: 6,
  },
});
