import {
  View,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const phrases = [
  "planet",
  "suit",
  "civil",
  "dignity",
  "rough",
  "jump",
  "burden",
  "diary",
];

export default function CreateWallet() {
  return (
    <KeyboardAwareScrollView extraScrollHeight={20} style={styles.container}>
      <View>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Backup your mnemonic securely</Text>
        </View>
        <View style={styles.phraseWrapper}>
          {phrases.map((el, index) => {
            return (
              <Text key={el} style={styles.word}>
                {index + 1}. {el}
              </Text>
            );
          })}
          <Text style={styles.copyTitle}>Copy to clipboard</Text>
        </View>
        <Text style={styles.label}>Wallet nickname</Text>
        <TextInput style={styles.textInput} />
        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.textInput} />
        <View style={styles.bottomSpace} />
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAF8FE",
    flex: 1,
    paddingHorizontal: 16,
  },
  titleWrapper: {
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 15,
  },
  title: {
    fontWeight: "bold",
    color: "#404D69",
    fontSize: 16,
  },
  phraseWrapper: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  word: {
    borderRadius: 5,
    borderColor: "#7282DF",
    borderWidth: 2,
    marginRight: 15,
    marginBottom: 15,
    padding: 5,
    color: "#7282DF",
    fontWeight: "600",
  },
  copyTitle: {
    fontWeight: "bold",
    color: "#7282DF",
    fontSize: 16,
    textAlign: "center",
    flexGrow: 1,
    width: "100%",
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    marginTop: 20,
    fontSize: 12,
    fontWeight: "bold",
    color: "#505A74",
  },
  textInput: {
    width: "100%",
    backgroundColor: "white",
    marginTop: 5,
    padding: 10,
    borderRadius: 5,
  },
  bottomSpace: {
    height: 20,
  },
});
