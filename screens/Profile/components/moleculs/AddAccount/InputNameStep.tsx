import { StyleSheet, Text, View } from "react-native";
import { Search, Subtitle, Title } from "../../atoms";
import { Button, ButtonBack } from "components/atoms";
import { observer } from "mobx-react-lite";
import { COLOR, InputHandler } from "utils";

type InputNameStepProps = {
  input: InputHandler;
  isAddDisable: boolean;
  onPressAdd(): void;
  onPressBack(): void;
};

export default observer(
  ({ input, onPressAdd, onPressBack, isAddDisable }: InputNameStepProps) => (
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
        isFocus={input.isFocused}
        onFocus={input.focusON}
        onBlur={input.focusOFF}
        style={{ marginBottom: 24 }}
        keyboardAppearance="dark"
      />
      <Subtitle style={styles.subtitle}>
        Access VIP experiences, exclusive previews,{"\n"}
        finance your own music projects and have your say.
      </Subtitle>
      <View style={styles.footer}>
        <ButtonBack onPress={onPressBack} />
        <View style={{ width: "66%" }}>
          <Button
            text="Add Account"
            disable={isAddDisable}
            contentContainerStyle={styles.buttonContinueContent}
            textStyle={styles.buttonContinueText}
            onPress={onPressAdd}
          />
        </View>
      </View>
    </>
  )
);

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    position: "absolute",
    bottom: 0,
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
    paddingVertical: 18,
  },
  buttonContinueText: {
    fontSize: 14,
    lineHeight: 18,
  },
});
