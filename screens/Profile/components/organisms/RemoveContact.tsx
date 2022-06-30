import { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { observer } from "mobx-react-lite";
import { IPerson } from "classes/types";
import { useStore } from "hooks";
import { COLOR } from "utils";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { BottomSheet } from "components/moleculs";
import { Button } from "components/atoms";
import { useBottomSheetBackButton } from "../../hooks";
import { Title } from "../atoms";

type Props = {
  contact: IPerson | null;
  isOpen?: boolean;
  animatedPosition?: SharedValue<number>;
  backgroundStyle: StyleProp<
    Omit<ViewStyle, "bottom" | "left" | "position" | "right" | "top">
  >;
  onClose?(): void;
};

export default observer<Props>(
  ({ backgroundStyle, animatedPosition, onClose, contact, isOpen }) => {
    const { contacts } = useStore();

    // ------ BottomSheet -------

    const snapPoints = useMemo(() => [270], []);
    const bottomSheet = useRef<BottomSheetMethods>(null);

    const close = () => bottomSheet.current?.close();
    const open = (index: number) => bottomSheet.current?.snapToIndex(index);

    useEffect(() => (isOpen ? open(0) : close()), [isOpen]);

    const handleClose = useCallback(() => onClose && onClose(), [onClose]);

    useBottomSheetBackButton(isOpen, handleClose);

    // -------------------------

    const remove = useCallback(() => {
      contact && contacts.delete(contact);
      close();
    }, [contact]);

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
          <Title style={styles.title}>
            Do you want remove{"\n"}
            {contact?.nickname}?
          </Title>

          <Button
            mode="fill"
            onPress={remove}
            contentContainerStyle={styles.buttonContent}
            textStyle={styles.buttonText}
            style={styles.button}
            text="Remove"
          />
          <Button
            mode="fill"
            onPress={close}
            contentContainerStyle={styles.buttonContent}
            textStyle={styles.buttonText}
            text="Cancel"
          />
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginHorizontal: 26,
  },
  title: {
    fontSize: 20,
    lineHeight: 25,
    textAlign: "center",
    marginBottom: 36,
  },
  button: {
    backgroundColor: COLOR.Dark2,
  },
  buttonContent: {
    paddingVertical: 18,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 20,
  },
});
