import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { observer } from "mobx-react-lite";
import { useTheme } from "hooks";
import { COLOR } from "utils";
import { Phrase } from "classes";
import { Button } from "components/atoms";
import { BottomSheet, Phrase as PhraseView } from "components/moleculs";
import { Title } from "../atoms";
import { SharedValue } from "react-native-reanimated";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

type Props = {
  isOpen?: boolean;
  animatedPosition?: SharedValue<number>;
  backgroundStyle: StyleProp<
    Omit<ViewStyle, "bottom" | "left" | "position" | "right" | "top">
  >;
  onClose?(): void;
};

export default observer<Props>(
  ({ backgroundStyle, animatedPosition, isOpen, onClose }: Props) => {
    const theme = useTheme();

    // ------ BottomSheet -------

    const snapPoints = useMemo(() => ["95%"], []);
    const bottomSheet = useRef<BottomSheetMethods>(null);

    const close = () => bottomSheet.current?.close();
    const open = () => bottomSheet.current?.snapToIndex(0);

    useEffect(() => (isOpen ? open() : close()), [isOpen]);

    // ------- Phrase ---------

    const phrase = useMemo(() => new Phrase(), []);

    const [isHidden, setHidden] = useState(true);
    const toggle = useCallback(() => setHidden((value) => !value), []);

    useEffect(() => {
      phrase.create();
    }, [phrase]);

    // --------- Close -----------

    const handleClose = useCallback(() => {
      onClose && onClose();
    }, [onClose]);

    return (
      <BottomSheet
        enablePanDownToClose
        snapPoints={snapPoints}
        ref={bottomSheet}
        backgroundStyle={backgroundStyle}
        animatedPosition={animatedPosition}
        onClose={handleClose}
        // onAnimate={handleAnimate}
        index={-1}
      >
        <View style={styles.container}>
          <Title style={styles.title}>Create new Mnemonics</Title>
          <Text style={styles.caption}>
            This is the only way you will be able to{"\n"}
            recover your account.Please store it {"\n"}
            somewhere safe!
          </Text>
          <Button
            style={styles.buttonToggle}
            onPress={toggle}
            contentContainerStyle={styles.buttonToggleContainer}
          >
            Show
          </Button>
          <View style={{ height: 320, width: "100%" }}>
            <BottomSheetScrollView style={{ height: 370 }}>
              <PhraseView
                style={styles.phrase}
                hidden={isHidden}
                value={phrase.words}
              />
            </BottomSheetScrollView>
          </View>

          <View style={styles.footer}>
            <Button
              contentContainerStyle={styles.buttonContinueContent}
              textStyle={styles.buttonContinueText}
            >
              Continue
            </Button>
          </View>
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,

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

  buttonToggle: {
    marginBottom: 25,
  },
  buttonToggleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  phrase: {
    alignItems: "center",
  },

  footer: {
    justifyContent: "flex-end",
    // backgroundColor: "orange",
    flexGrow: 1,
    marginTop: 30,
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
