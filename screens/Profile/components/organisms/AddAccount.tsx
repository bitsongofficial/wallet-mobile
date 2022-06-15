import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { observer } from "mobx-react-lite";
import { useStore, useTheme } from "hooks";
import { COLOR, hexAlpha, InputHandler } from "utils";
import Icon2, { IconName } from "components/atoms/Icon2";
import { Agreement, Search, Subtitle, Title } from "../atoms";
import { SharedValue } from "react-native-reanimated";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { BottomSheet, Phrase as PhraseView } from "components/moleculs";
import { Phrase, Steps } from "classes";
import { Button } from "components/atoms";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PhraseInput } from "screens/CreateSeed/components/organisms";
import useBottomSheetBackButton from "screens/Profile/hooks/useBottomSheetBackButton";

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
    const {wallet} = useStore()
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

    const saveWallet = () =>
    {
      wallet.newCosmosWallet(input.value, phrase.words)
    }

    return (
      <>
        <BottomSheet
          enablePanDownToClose
          snapPoints={snapPoints}
          ref={bottomSheet}
          backgroundStyle={backgroundStyle}
          animatedPosition={animatedPosition}
          onClose={handleClose}
          android_keyboardInputMode="adjustResize"
          index={-1}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "height" : "padding"}
            style={styles.container}
          >
            {steps.title === "Choose" && (
              <>
                <Title style={styles.title}>Add a new account</Title>
                <View style={styles.buttons}>
                  <ButtonChoose
                    icon="wallet"
                    text="Create Account"
                    onPress={openCreate}
                    style={{ marginBottom: 12 }}
                  />
                  <ButtonChoose
                    icon="wallet"
                    text="Import Mnemonics"
                    onPress={openImport}
                  />
                </View>
                <Agreement style={styles.agreements} />
              </>
            )}

            {steps.title === "Create" && (
              <>
                <Title style={styles.title}>Create new Mnemonics</Title>
                <Text style={styles.caption}>
                  This is the only way you will be able to{"\n"}
                  recover your account.Please store it {"\n"}
                  somewhere safe!
                </Text>
                <View style={{ alignItems: "center" }}>
                  <Button
                    style={styles.buttonToggle}
                    onPress={toggle}
                    // mode={isHidden ? "gradient" : ""}
                    text={isHidden ? "Show" : "Hide"}
                    contentContainerStyle={styles.buttonToggleContainer}
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
            )}

            {steps.title === "Name" && (
              <>
                <Title style={styles.title}>Name your Wallet</Title>
                <Text style={styles.caption}>
                  This is the only way you will be able to{"\n"}
                  recover your account.Please store it {"\n"}
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
                    onPress={saveWallet}
                  />
                </View>
              </>
            )}
            {steps.title === "Import" && (
              <View style={{ flexGrow: 1 }}>
                <Title style={styles.title}>Import Mnemonics</Title>
                <Text style={styles.caption}>
                  This is the only way you will be able to{"\n"}
                  recover your account.Please store it {"\n"}
                  somewhere safe!
                </Text>
                <PhraseInput
                  phrase={phrase}
                  bottomsheet
                  scrollStyle={{
                    flexGrow: 1,
                  }}
                  inputStyle={{
                    flexGrow: 1,
                    justifyContent: "flex-end",
                    paddingVertical: 8,
                    paddingBottom: insent.bottom || 8,
                  }}
                />
              </View>
            )}
          </KeyboardAvoidingView>
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

type ButtonProps = {
  icon: IconName;
  text: string;
  style?: StyleProp<ViewStyle>;
  onPress?(): void;
};

const ButtonChoose = ({ icon, text, style, onPress }: ButtonProps) => (
  <TouchableOpacity style={[styles.buttonContainer, style]} onPress={onPress}>
    <View style={styles.left}>
      <Icon2
        name={icon}
        style={styles.icon}
        stroke={hexAlpha(COLOR.White, 50)}
        size={20}
      />
      <Text style={styles.text}>{text}</Text>
    </View>

    <Icon2 name="chevron_right" stroke={COLOR.White} size={18} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginHorizontal: 26,
    flexGrow: 1,
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
