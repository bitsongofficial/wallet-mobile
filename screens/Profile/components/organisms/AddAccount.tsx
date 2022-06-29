import {
  Platform,
  StyleProp,
  StyleSheet,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { observer } from "mobx-react-lite";
import { useStore } from "hooks";
import { COLOR, hexAlpha, InputHandler } from "utils";
import { SharedValue } from "react-native-reanimated";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { BottomSheet, InputWord } from "components/moleculs";
import { Phrase, Steps } from "classes";
import { Button } from "components/atoms";
import {
  BottomSheetFooter,
  BottomSheetFooterProps,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useBottomSheetBackButton from "screens/Profile/hooks/useBottomSheetBackButton";
import {
  ChooseStep,
  CreateStep,
  ImportStep,
  InputNameStep,
} from "../moleculs/AddAccount";
import * as Clipboard from "expo-clipboard";

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
    const { wallet } = useStore();
    // ------ BottomSheet -------
    const snapPoints = useMemo(() => [350, "95%"], []);
    const bottomSheet = useRef<BottomSheetMethods>(null);

    const close = () => bottomSheet.current?.close();
    const open = (index: number) => bottomSheet.current?.snapToIndex(index);

    useEffect(() => (isOpen ? open(0) : close()), [isOpen]);

    // --------- Steps ------------
    const steps = useMemo(
      () => new Steps(["Choose", "Create", "Name", "Import"]),
      []
    );

    const openCreate = useCallback(() => {
      open(1);
      phrase.create();
      steps.goTo("Create");
    }, []);

    const openImport = useCallback(() => {
      open(1);
      phrase.clear();
      steps.goTo("Import");
    }, []);

    const openName = useCallback(() => {
      open(1);
      steps.goTo("Name");
    }, []);

    const goBack = useCallback(() => {
      if (steps.active === 0) {
        close();
      } else {
        steps.goBack();
        if (steps.title === "Choose") {
          open(0);
        }
      }
    }, []);

    // --------- Buttons ----------

    const insent = useSafeAreaInsets();

    // --------- Phrase ----------

    const phrase = useMemo(() => new Phrase(), []);

    const [isHidden, setHidden] = useState(true);
    const toggle = useCallback(() => setHidden((value) => !value), []);

    useEffect(() => {
      setHidden(true);
    }, [steps.active]);

    const paste = useCallback(async () => {
      const clipboard = await Clipboard.getStringAsync();
      const words = clipboard.split(/[^a-zа-я$]+/gi, 12).filter((w) => w);

      if (words.length === 12) {
        phrase.setWords(words);
        phrase.setActiveIndex(phrase.words.length - 1);
      }
    }, [phrase]);

    const handlePressGo = useCallback(() => {
      phrase.inputSubmit();
      phrase.isValid && steps.goTo("Name");
    }, []);

    // ---------- Name -----------

    const input = useMemo(() => new InputHandler(), []);

    // --------- Close -----------

    const handleClose = useCallback(() => {
      onClose && onClose();
      steps.goTo("Choose");
      input.clear();
      phrase.clear();
    }, [onClose]);

    useBottomSheetBackButton(isOpen, goBack);

    const saveWallet = useCallback(() => {
      if (input.value && phrase.isValid) {
        wallet.newCosmosWallet(input.value, phrase.words);
        close();
      }
    }, []);

    return (
      <>
        <BottomSheet
          enablePanDownToClose
          snapPoints={snapPoints}
          ref={bottomSheet}
          backgroundStyle={[backgroundStyle]}
          animatedPosition={animatedPosition}
          onClose={handleClose}
          android_keyboardInputMode="adjustResize"
          keyboardBehavior={
            Platform.OS === "android" ? "interactive" : "fillParent"
          }
          index={-1}
          footerComponent={(props) =>
            steps.title === "Import" && (
              <Footer
                {...props}
                phrase={phrase}
                onPressDone={openName}
                onPressInputKeyboardSubmit={handlePressGo}
              />
            )
          }
        >
          {steps.title === "Choose" && (
            <View style={[styles.wrapper]}>
              <ChooseStep
                onPressCreate={openCreate}
                onPressImport={openImport}
              />
            </View>
          )}
          {steps.title === "Create" && (
            <View style={[styles.wrapper]}>
              <CreateStep
                isHidden={isHidden}
                phrase={phrase}
                onPressToggle={toggle}
              />
            </View>
          )}
          {steps.title === "Name" && (
            <View style={[styles.wrapper]}>
              <InputNameStep
                input={input}
                isAddDisable={!phrase.isValid || input.value.length < 3}
                onPressAdd={saveWallet}
                onPressBack={goBack}
              />
            </View>
          )}
          {steps.title === "Import" && (
            <ImportStep onPressPaste={paste} phrase={phrase} />
          )}
        </BottomSheet>
        {steps.title === "Create" && (
          <View style={[styles.footer, { bottom: insent.bottom }]}>
            <Button
              text="Continue"
              contentContainerStyle={styles.buttonContinueContent}
              textStyle={styles.buttonContinueText}
              onPress={openName}
            />
          </View>
        )}
      </>
    );
  }
);

type FooterProps = BottomSheetFooterProps & {
  phrase: Phrase;
  onPressDone(): void;
  onPressInputKeyboardSubmit: TextInputProps["onSubmitEditing"];
};

const Footer = observer(
  ({
    phrase,
    animatedFooterPosition,
    onPressDone,
    onPressInputKeyboardSubmit,
  }: FooterProps) => {
    return (
      <BottomSheetFooter
        animatedFooterPosition={animatedFooterPosition}
        bottomInset={24}
      >
        {phrase.words.length === 16 ? (
          <Button
            text="Done"
            onPress={onPressDone}
            style={{ marginHorizontal: 26 }}
            textStyle={styles.buttonContinueText}
            contentContainerStyle={styles.buttonContinueContent}
          />
        ) : (
          <InputWord
            bottomsheet
            onSubmitEditing={onPressInputKeyboardSubmit}
            phrase={phrase}
            style={{ marginHorizontal: 16, marginBottom: 16 }}
          />
        )}
      </BottomSheetFooter>
    );
  }
);

// ----------------------

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 15,
    marginHorizontal: 26,
    flex: 1,
  },
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

  buttons: {
    marginBottom: 30,
  },
  agreements: {
    paddingHorizontal: 8,
    color: "#5C5B77",
  },

  //  ------- Button ----------
  button: {
    flexGrow: 1,
    justifyContent: "flex-end",
    padding: 16,
  },

  buttonContainer: {
    backgroundColor: hexAlpha(COLOR.Lavender, 10),
    height: 62,
    borderRadius: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 22,
  },
  buttonToggle: {
    marginBottom: 25,
  },
  buttonToggleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  // -----

  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 20,
  },
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
    color: COLOR.White,
  },

  // ------ Footer -----

  footer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: "center",

    position: "absolute",
    bottom: 20,
    paddingBottom: 16,
    width: "100%",
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
