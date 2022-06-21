import { StyleSheet, Text, View } from "react-native";
import { Search, Subtitle, Title } from "../../atoms";
import { Button } from "components/atoms";
import { observer } from "mobx-react-lite";
import { COLOR, InputHandler } from "utils";

type InputNameStepProps = {
  input: InputHandler;
  onPressAdd(): void;
};

export default observer(({ input, onPressAdd }: InputNameStepProps) => (
  <>
    <Title style={styles.title}>Name your Wallet</Title>
    <Text style={styles.caption}>
      This is the only way you will be able to{"\n"}
      recover your account.Please onPressAddstore it {"\n"}
      somewhere safe!
    </Text>
    <Search
      loupe={false}
      value={input.value}
      onChangeText={input.set}
      placeholder="Write a name"
      autoFocus
      style={{ marginBottom: 24 }}
      keyboardAppearance="dark"
    />
    <Subtitle style={styles.subtitle}>
      Access VIP experiences, exclusive previews,{"\n"}
      finance your own music projects and have your say.
    </Subtitle>
    <View style={styles.footer}>
      <Button
        text="Add Account"
        contentContainerStyle={styles.buttonContinueContent}
        textStyle={styles.buttonContinueText}
        onPress={onPressAdd}
      />
    </View>
  </>
));

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",

    marginBottom: 30,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 18,
    textAlign: "center",
    opacity: 0.3,
  },
  footer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: "center",

    position: "absolute",
    bottom: 20,
    paddingBottom: 16,
    width: "100%",
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

  buttonContinueContent: {
    paddingHorizontal: 40,
    paddingVertical: 18,
  },
  buttonContinueText: {
    fontSize: 14,
    lineHeight: 18,
  },
});
