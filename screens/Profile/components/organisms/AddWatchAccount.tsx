import { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { observer } from "mobx-react-lite";
import { InputHandler } from "utils";
import * as Clipboard from "expo-clipboard";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Steps } from "classes";
import { BottomSheet } from "components/moleculs";
import { useBottomSheetBackButton } from "../../hooks";
import { Button } from "components/atoms";
import { Search, Subtitle, Title } from "../atoms";
import { useLoading, useStore } from "hooks";

type Props = {
  isOpen?: boolean;
  animatedPosition?: SharedValue<number>;
  backgroundStyle: StyleProp<
    Omit<ViewStyle, "bottom" | "left" | "position" | "right" | "top">
  >;
  onClose?(): void;
};

export default observer<Props>(
  ({ backgroundStyle, animatedPosition, isOpen, onClose }) => {

    const {wallet, settings} = useStore()
    const loading = useLoading()
    // ----------- Input ----------

    const inputWallet = useMemo(() => new InputHandler(), []);
    const inputName = useMemo(() => new InputHandler(), []);

    const pasteFromClipboard = useCallback(
      async () => inputWallet.set(await Clipboard.getStringAsync()),
      []
    );

    // ------ BottomSheet -------

    const snapPoints = useMemo(() => [350], []);
    const bottomSheet = useRef<BottomSheetMethods>(null);

    const close = () => bottomSheet.current?.close();
    const open = (index: number) => bottomSheet.current?.snapToIndex(index);
    const saveWallet = async () =>
    {
      loading.open()
      await wallet.newWatchWallet(inputName.value, inputWallet.value)
      loading.close()
      close()
    }
    useEffect(() => {
      isOpen ? open(0) : close();
    }, [isOpen]);

    // --------- Steps ------------

    const steps = useMemo(() => new Steps(["Add", "Name"]), []);

    const openStepAdd = useCallback(() => {
      steps.goTo("Add");
    }, []);

    const openStepName = useCallback(() => {
      steps.goTo("Name");
    }, []);

    // --------- Close -----------

    const handleClose = useCallback(() => {
      onClose && onClose();
      openStepAdd();
    }, [onClose]);

    useBottomSheetBackButton(isOpen, handleClose);

    return (
      <BottomSheet
        enablePanDownToClose
        snapPoints={snapPoints}
        ref={bottomSheet}
        backgroundStyle={backgroundStyle}
        animatedPosition={animatedPosition}
        onClose={handleClose}
        index={-1}
      >
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
            {steps.title === "Name" && inputName.value.length > 3 && (
              <Button
                text="Add Account"
                onPress={saveWallet}
                contentContainerStyle={styles.buttonContent}
                textStyle={styles.buttonText}
              />
            )}
          </View>
        </View>
      </BottomSheet>
    );
  }
);

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
