import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { observer } from "mobx-react-lite";
import { IPerson } from "classes/types";
import { useStore } from "hooks";
import { COLOR, InputHandler } from "utils";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { BottomSheet } from "components/moleculs";
import { Button, ButtonBack, Icon2 } from "components/atoms";
import { useBottomSheetBackButton } from "../../hooks";
import { Search, Title } from "../atoms";
import { RectButton } from "react-native-gesture-handler";
import { Steps } from "classes";
import { useNavigation } from "@react-navigation/native";
import { ButtonAvatar } from "../moleculs";
import { runInAction } from "mobx";

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

    // --------- Steps ----------

    const steps = useMemo(() => new Steps(["Data", "Photo"]), []);

    const goBack = useCallback(
      () => (steps.active > 0 ? steps.goBack() : close()),
      [steps.active]
    );

    // ------ BottomSheet -------

    const snapPoints = useMemo(() => {
      switch (steps.title) {
        case "Data":
          return [460];
        case "Photo":
        default:
          return [375];
      }
    }, [steps.title]);

    const bottomSheet = useRef<BottomSheetMethods>(null);

    const close = () => bottomSheet.current?.close();
    const open = (index: number) => bottomSheet.current?.snapToIndex(index);

    useEffect(() => (isOpen ? open(0) : close()), [isOpen]);

    const handleClose = useCallback(() => onClose && onClose(), [onClose]);

    useBottomSheetBackButton(isOpen, handleClose);

    // -------------------------

    const inputAddress = useMemo(
      () => new InputHandler(contact?.address),
      [contact?.address]
    );
    const inputNickname = useMemo(
      () => new InputHandler(contact?.nickname),
      [contact?.nickname]
    );

    const navigation = useNavigation();
    const navToScan = useCallback(
      () =>
        navigation.push("ScannerQR", { onBarCodeScanned: inputAddress.set }),
      []
    );

    // ------- Image ----------

    const [image, setImage] = useState<string | null>(null);

    const source = useMemo(
      () =>
        contact?.avatar || image ? { uri: image || contact?.avatar } : null,
      [image]
    );

    // -------------------------

    const save = useCallback(() => {
      runInAction(() => {
        if (contact) {
          contact.address = inputAddress.value;
          contact.nickname = inputNickname.value;
          if (image) {
            contact.avatar = image;
          }
        }
      });
      close();
    }, []);

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
          {steps.title === "Data" && (
            <>
              <Title style={styles.title}>Edit Contact</Title>

              <View style={{ marginBottom: 24 }}>
                <Text style={styles.label}>Edit address</Text>
                <Search
                  value={inputAddress.value}
                  onChangeText={inputAddress.set}
                  loupe={false}
                  Right={
                    <RectButton style={styles.button_qr} onPress={navToScan}>
                      <Icon2
                        name="qr_code"
                        stroke={COLOR.RoyalBlue}
                        size={22}
                      />
                    </RectButton>
                  }
                />
              </View>

              <View>
                <Text style={styles.label}>Edit name</Text>
                <Search
                  value={inputNickname.value}
                  onChangeText={inputNickname.set}
                  loupe={false}
                />
              </View>
            </>
          )}

          {steps.title === "Photo" && (
            <>
              <Title style={styles.title}>Edit Profile Photo</Title>

              <View style={styles.avatar}>
                <ButtonAvatar source={source} onChange={setImage} />
              </View>
            </>
          )}

          <View style={styles.footer}>
            <View style={styles.buttons}>
              <ButtonBack onPress={goBack} />

              {steps.title === "Data" ? (
                <Button
                  text="Continue"
                  onPress={steps.next}
                  textStyle={styles.buttonText}
                  contentContainerStyle={styles.buttonContent}
                />
              ) : (
                <Button
                  onPress={save}
                  text="Save"
                  textStyle={styles.buttonText}
                  contentContainerStyle={styles.buttonContent}
                />
              )}
            </View>
          </View>
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginHorizontal: 26,
    marginBottom: 32,
    flex: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 36,
  },
  label: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
    color: COLOR.White,

    marginBottom: 8,
  },
  avatar: {
    alignItems: "center",
  },

  // ------ Footer ----------

  footer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },

  button_qr: {
    padding: 23,
  },

  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  button: { backgroundColor: COLOR.Dark2 },
  buttonContent: {
    paddingVertical: 18,
    paddingHorizontal: 46,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 20,
  },
});
