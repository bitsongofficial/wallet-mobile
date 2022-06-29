import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { observer } from "mobx-react-lite";
import { COLOR, InputHandler } from "utils";
import * as Clipboard from "expo-clipboard";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Steps } from "classes";
import { BottomSheet } from "components/moleculs";
import { useBottomSheetBackButton } from "../../hooks";
import { Button, ButtonBack, Icon2 } from "components/atoms";
import { Search, Subtitle, Title } from "../atoms";
import { TouchableOpacity } from "react-native-gesture-handler";

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
    // ----------- Input ----------

    const inputWallet = useMemo(() => new InputHandler(), []);
    const inputName = useMemo(() => new InputHandler(), []);

    const pasteFromClipboard = useCallback(
      async () => inputWallet.set(await Clipboard.getStringAsync()),
      []
    );

    // ------ BottomSheet -------

    const [snapPoints, setSnapPoints] = useState([350]);

    const bottomSheet = useRef<BottomSheetMethods>(null);

    const close = () => bottomSheet.current?.close();
    const open = (index: number) => bottomSheet.current?.snapToIndex(index);

    useEffect(() => {
      isOpen ? open(0) : close();
    }, [isOpen]);

    // --------- Steps ------------

    const steps = useMemo(() => new Steps(["Add", "Name", "Avatar"]), []);

    const openStepAdd = useCallback(() => {
      steps.goTo("Add");
    }, []);

    const openStepName = useCallback(() => {
      steps.goTo("Name");
    }, []);

    const openAvatar = useCallback(() => {
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
              <Title style={styles.title}>Add Contact</Title>
              <Search
                loupe={false}
                style={styles.search}
                placeholder="Public Address"
                value={inputWallet.value}
                onChangeText={inputWallet.set}
                Right={
                  <TouchableOpacity style={styles.iconTouchable}>
                    <Icon2 name="qr_code" size={18} stroke={COLOR.Marengo} />
                  </TouchableOpacity>
                }
              />
            </>
          )}
          {steps.title === "Name" && (
            <>
              <Title style={styles.title}>Name your Contact</Title>
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
            {steps.title === "Add" ? (
              <View style={styles.footer_1}>
                <Button
                  text="Continue"
                  onPress={openStepName}
                  contentContainerStyle={styles.buttonContent}
                  textStyle={styles.buttonText}
                />
              </View>
            ) : (
              <View style={styles.footer_2}>
                <ButtonBack onPress={steps.goBack} />
                <Button
                  text="Continue"
                  onPress={close}
                  contentContainerStyle={styles.buttonContent}
                  textStyle={styles.buttonText}
                />
              </View>
            )}
          </View>
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    // alignItems: "center",
    marginTop: 15,
    marginHorizontal: 26,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",
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

  iconTouchable: {
    padding: 23,
  },

  footer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    marginTop: 20,
  },

  footer_1: {
    alignItems: "center",
  },
  footer_2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  buttonContent: {
    paddingHorizontal: 31,
    paddingVertical: 18,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 18,
  },
});
