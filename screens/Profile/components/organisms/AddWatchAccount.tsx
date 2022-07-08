import { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { observer } from "mobx-react-lite";
import { InputHandler } from "utils";
import { Steps } from "classes";
import { Button } from "components/atoms";
import { Search, Subtitle, Title } from "../atoms";

type Props = {
  close(): void;
};

export default observer<Props>(({ close }) => {
  // ----------- Input ----------

  const inputWallet = useMemo(() => new InputHandler(), []);
  const inputName = useMemo(() => new InputHandler(), []);

  const pasteFromClipboard = useCallback(
    async () => inputWallet.set(await Clipboard.getStringAsync()),
    []
  );

  // --------- Steps ------------

  const steps = useMemo(() => new Steps(["Add", "Name"]), []);

  const openStepName = useCallback(() => steps.goTo("Name"), []);

  return (
    <View style={styles.container}>
      {steps.title === "Add" && (
        <>
          <Title style={styles.title}>Add Watch Account</Title>
          <Search
            loupe={false}
            style={styles.search}
            placeholder="Public Address"
            value={inputWallet.value}
            onChangeText={inputWallet.set}
            Right={
              <Button
                text="Paste"
                onPress={pasteFromClipboard}
                style={styles.buttonPaste}
                contentContainerStyle={styles.buttonPasteContent}
              />
            }
          />
        </>
      )}
      {steps.title === "Name" && (
        <>
          <Title style={styles.title}>Name your Wallet</Title>
          <Search
            loupe={false}
            value={inputName.value}
            onChangeText={inputName.set}
            style={styles.search}
            placeholder="Write a name"
          />
        </>
      )}

      <Subtitle style={styles.subtitle}>
        Access VIP experiences, exclusive previews,{"\n"}
        finance your own and have your say.
      </Subtitle>

      <View style={styles.footer}>
        {steps.title === "Add" && (
          <Button
            text="Proceed"
            onPress={openStepName}
            contentContainerStyle={styles.buttonContent}
            textStyle={styles.buttonText}
          />
        )}
        {steps.title === "Name" && (
          <Button
            text="Add Account"
            onPress={close}
            contentContainerStyle={styles.buttonContent}
            textStyle={styles.buttonText}
          />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 15,
    marginHorizontal: 26,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,

    marginBottom: 36,
  },
  subtitle: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.5,

    textAlign: "center",

    marginBottom: 18,
  },

  search: {
    marginBottom: 24,
  },

  // -------- Button ----------
  buttonPaste: {
    marginHorizontal: 14,
  },
  buttonPasteContent: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  footer: {
    justifyContent: "flex-end",
    flexGrow: 1,
    marginTop: 20,
  },

  buttonContent: {
    paddingHorizontal: 77,
    paddingVertical: 18,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 18,
  },
});
