import { useCallback } from "react";
import { Platform, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useDimensions } from "@react-native-community/hooks";
import { reaction } from "mobx";
import { Phrase, Steps } from "classes";
import { useGlobalBottomsheet } from "hooks";
import { COLOR } from "utils";
import {
  AddWatchAccount,
  ChangeAvatar,
  ChangeCurrency,
  ChangeLanguage,
  ChangeWallet,
  AddAccount,
} from "../components/organisms";

export default function useBottomSheetModals() {
  const gbs = useGlobalBottomsheet();

  const { screen } = useDimensions();
  const animatedPosition = useSharedValue(screen.height);

  const close = useCallback(() => gbs.close(), []);

  const changeAvatar = useCallback(() => {
    gbs.setProps({
      enablePanDownToClose: true,
      snapPoints: [350],
      animatedPosition,
      backgroundStyle: styles.background,
      android_keyboardInputMode: undefined,
      children: <ChangeAvatar close={close} />,
    });
    gbs.snapToIndex(0);
  }, []);

  const addWatchAccount = useCallback(() => {
    gbs.setProps({
      enablePanDownToClose: true,
      snapPoints: [350],
      animatedPosition,
      backgroundStyle: styles.background,
      android_keyboardInputMode: "adjustResize",
      children: () => <AddWatchAccount close={close} />,
    });
    gbs.snapToIndex(0);
  }, []);

  const changeWallet = useCallback(() => {
    gbs.setProps({
      enablePanDownToClose: true,
      snapPoints: ["95%"],
      animatedPosition,
      backgroundStyle: styles.background,
      android_keyboardInputMode: "adjustResize",
      children: () => <ChangeWallet close={close} />,
    });
    gbs.snapToIndex(0);
  }, []);

  const changeLanguage = useCallback(() => {
    gbs.setProps({
      enablePanDownToClose: true,
      snapPoints: ["95%"],
      animatedPosition,
      backgroundStyle: styles.background,
      android_keyboardInputMode: "adjustResize",
      children: () => <ChangeLanguage close={close} />,
    });
    gbs.snapToIndex(0);
  }, []);

  const channgeCurrency = useCallback(() => {
    gbs.setProps({
      enablePanDownToClose: true,
      snapPoints: ["95%"],
      animatedPosition,
      backgroundStyle: styles.background,
      android_keyboardInputMode: "adjustResize",
      children: () => <ChangeCurrency close={close} />,
    });
    gbs.snapToIndex(0);
  }, []);

  const addAccount = useCallback(() => {
    const steps = new Steps(["Choose", "Create", "Name", "Import"]);
    const phrase = new Phrase();

    const disposer = reaction(
      () => steps.title,
      (title) => {
        switch (title) {
          case "Create":
            gbs.updProps({ snapPoints: ["95%"] });
            phrase.create();
            break;
          case "Import":
            gbs.updProps({ snapPoints: ["95%"] });
            phrase.clear();
            break;
          case "Name":
            gbs.updProps({ snapPoints: ["95%"] });
            break;
          default:
            gbs.updProps({ snapPoints: [350] });
            break;
        }
      }
    );

    gbs.setProps({
      enablePanDownToClose: true,
      snapPoints: [350],
      animatedPosition,
      backgroundStyle: styles.background,
      android_keyboardInputMode: "adjustResize",
      keyboardBehavior:
        Platform.OS === "android" ? "interactive" : "fillParent",

      onClose: () => {
        disposer();
      },

      children: () => (
        <AddAccount steps={steps} phrase={phrase} close={close} />
      ),
    });

    gbs.snapToIndex(0);
  }, []);

  return [
    animatedPosition,
    {
      changeAvatar,
      addAccount,
      addWatchAccount,
      changeWallet,
      changeLanguage,
      channgeCurrency,
    },
    close,
  ] as const;
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: COLOR.Dark3,
    paddingTop: 30,
  },
});
