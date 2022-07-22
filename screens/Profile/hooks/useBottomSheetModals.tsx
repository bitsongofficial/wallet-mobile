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
  AddContact,
  EditContact,
  RemoveContact,
} from "../components/organisms";
import { useNavigation } from "@react-navigation/native";
import { Contact } from "stores/ContactsStore";
import { RootStackParamList } from "types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function useBottomSheetModals() {
  const gbs = useGlobalBottomsheet();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { screen } = useDimensions();
  const animatedPosition = useSharedValue(screen.height);

  const close = useCallback(() => gbs.close(), []);

  const changeAvatar = useCallback(() => {
    gbs.setProps({
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
      snapPoints: [350],
      animatedPosition,
      backgroundStyle: styles.background,

      children: <AddWatchAccount close={close} />,
    });
    gbs.snapToIndex(0);
  }, []);

  const changeWallet = useCallback(() => {
    gbs.setProps({
      snapPoints: ["95%"],
      animatedPosition,
      backgroundStyle: styles.background,

      children: <ChangeWallet close={close} />,
    });
    gbs.snapToIndex(0);
  }, []);

  const changeLanguage = useCallback(() => {
    gbs.setProps({
      snapPoints: ["95%"],
      animatedPosition,
      backgroundStyle: styles.background,

      children: <ChangeLanguage close={close} />,
    });
    gbs.snapToIndex(0);
  }, []);

  const channgeCurrency = useCallback(() => {
    gbs.setProps({
      snapPoints: ["95%"],
      animatedPosition,
      backgroundStyle: styles.background,

      children: <ChangeCurrency close={close} />,
    });
    gbs.snapToIndex(0);
  }, []);

  const addContact = useCallback(() => {
    gbs.setProps({
      snapPoints: [350],
      animatedPosition,
      backgroundStyle: styles.background,

      children: <AddContact close={close} />,
    });
    gbs.snapToIndex(0);
  }, []);

  const removeContact = useCallback((contact: Contact) => {
    gbs.setProps({
      snapPoints: [270],
      animatedPosition,
      backgroundStyle: styles.background,

      children: <RemoveContact close={close} contact={contact} />,
    });
    gbs.snapToIndex(0);
  }, []);

  const editContact = useCallback((contact: Contact) => {
    const steps = new Steps(["Data", "Photo"]);
    const disposer = reaction(
      () => steps.title,
      (title) => {
        switch (title) {
          case "Data":
            gbs.updProps({ snapPoints: [460] });
            break;
          case "Photo":
          default:
            gbs.updProps({ snapPoints: [410] });
            break;
        }
      }
    );

    gbs.setProps({
      snapPoints: [410],
      animatedPosition,
      backgroundStyle: styles.background,
      onClose: disposer,
      children: (
        <EditContact
          close={close}
          contact={contact}
          steps={steps}
          navigation={navigation}
        />
      ),
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
      snapPoints: [350],
      animatedPosition,
      backgroundStyle: styles.background,

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
      addContact,
      editContact,
      removeContact,
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
