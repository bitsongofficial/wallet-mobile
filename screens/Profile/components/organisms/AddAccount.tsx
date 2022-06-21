import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { observer } from "mobx-react-lite";
import { useStore } from "hooks";
import { COLOR, hexAlpha, InputHandler } from "utils";
import { Title } from "../atoms";
import { SharedValue } from "react-native-reanimated";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import {
  BottomSheet,
  InputWord,
  // Phrase as PhraseView,
  PhraseHorisontal,
} from "components/moleculs";
import { Phrase, Steps } from "classes";
import { Button, Input } from "components/atoms";
import {
  BottomSheetFooter,
  BottomSheetFooterProps,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useBottomSheetBackButton from "screens/Profile/hooks/useBottomSheetBackButton";
import { ChooseStep, CreateStep, InputNameStep } from "../moleculs/AddAccount";

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
      steps.goTo("Create");
    }, []);

    const openImport = useCallback(() => {
      open(1);
      steps.goTo("Import");
    }, []);

    const openName = useCallback(() => {
      open(1);
      steps.goTo("Name");
    }, []);

    // --------- Buttons ----------

    const insent = useSafeAreaInsets();

    // --------- Phrase ----------

    const phrase = useMemo(() => new Phrase(), []);

    const [isHidden, setHidden] = useState(true);
    const toggle = useCallback(() => setHidden((value) => !value), []);

    useEffect(() => {
      if (steps.title === "Create") phrase.create(); // TODO: need tests
    }, [phrase, steps.active]);

    // ---------- Name -----------

    const input = useMemo(() => new InputHandler(), []);

    // --------- Close -----------

    const handleClose = useCallback(() => {
      onClose && onClose();
      steps.goTo("Choose");
      input.clear();
      phrase.clear();
    }, [onClose]);

    useBottomSheetBackButton(isOpen, handleClose);

    const saveWallet = () => {
      wallet.newCosmosWallet(input.value, phrase.words);
    };

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
              <Footer {...props} phrase={phrase} onPressDone={openName} />
            )
          }
        >
          <View style={styles.wrapper}>
            {steps.title === "Choose" && (
              <ChooseStep
                onPressCreate={openCreate}
                onPressImport={openImport}
              />
            )}
            {steps.title === "Create" && (
              <CreateStep
                isHidden={isHidden}
                phrase={phrase}
                onPressToggle={toggle}
              />
            )}
            {steps.title === "Name" && (
              <InputNameStep
                input={input}
                onPressAdd={saveWallet}
                //
              />
            )}
          </View>
          {steps.title === "Import" && (
            <>
              <View style={styles.wrapper}>
                <Title style={styles.title}>Import Mnemonics</Title>
                <Text style={styles.caption}>
                  This is the only way you will be able to{"\n"}
                  recover your account.Please store it {"\n"}
                  somewhere safe!
                </Text>
              </View>
              <PhraseHorisontal
                phrase={phrase}
                contentContainerStyle={{ paddingHorizontal: 26 }}
              />
            </>
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
};

const Footer = observer(
  ({ phrase, animatedFooterPosition, onPressDone }: FooterProps) => {
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
