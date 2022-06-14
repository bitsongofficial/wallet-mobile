import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useStore, useTheme } from "hooks";
import { COLOR, hexAlpha } from "utils";
import { Button, Icon2 } from "components/atoms";
import { observer } from "mobx-react-lite";
import { Title } from "../atoms";
import { BottomSheet } from "components/moleculs";
import { SharedValue } from "react-native-reanimated";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import useBottomSheetBackButton from "screens/Profile/hooks/useBottomSheetBackButton";
import * as ImagePicker from "expo-image-picker";
import { RectButton } from "react-native-gesture-handler";

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
    const theme = useTheme();
    const { user } = useStore();

    // -------- Image -----------
    const [image, setImage] = useState<string | null>(null);

    const photo = useMemo<ImageSourcePropType | undefined | null>(
      () => ({ uri: image || user?.photo }),
      [image]
    );

    // const photo = require("assets/images/mock/avatar_2.png");

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    };

    // ------ BottomSheet -------

    const snapPoints = useMemo(() => [350], []);
    const bottomSheet = useRef<BottomSheetMethods>(null);

    const close = () => bottomSheet.current?.close();
    const open = () => bottomSheet.current?.snapToIndex(0);

    useEffect(() => {
      isOpen ? open() : close();
    }, [isOpen]);

    // --------- Close -----------

    const handleClose = useCallback(() => {
      onClose && onClose();
      // TODO: remove on business flow
      setImage(null);
    }, [onClose]);

    const save = useCallback(() => {
      if (photo) user?.setPhoto(photo.uri);
      close();
    }, [user, photo]);

    useBottomSheetBackButton(isOpen, handleClose);

    console.log("photo", photo);
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
          <Title style={styles.title}>Add Photos</Title>
          <Text style={[styles.subtitle, theme.text.primary]}>optional</Text>

          <RectButton onPress={pickImage}>
            <View style={styles.avatar}>
              {photo?.uri ? (
                <Image
                  source={photo}
                  width={107}
                  height={107}
                  style={styles.image}
                />
              ) : (
                <View style={styles.iconContainer}>
                  <Icon2 name="plus" size={33} />
                </View>
              )}
            </View>
          </RectButton>

          {image ? (
            <Button
              text="Proceed"
              onPress={save}
              contentContainerStyle={styles.buttonContent}
              textStyle={styles.buttonText}
            />
          ) : (
            <Button
              mode="fill"
              text="Skip"
              onPress={close}
              contentContainerStyle={[
                styles.buttonContent,
                styles.buttonContent_fill,
              ]}
              textStyle={styles.buttonText}
            />
          )}
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    lineHeight: 20,

    marginBottom: 9,
  },
  subtitle: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.5,

    marginBottom: 18,
  },
  avatar: {
    width: 129,
    height: 129,
    borderRadius: 129,
    backgroundColor: hexAlpha(COLOR.Silver, 5),
    alignItems: "center",
    justifyContent: "center",

    marginBottom: 24,
  },
  image: {
    width: 107,
    height: 107,
    borderRadius: 107,
  },

  iconContainer: {
    width: 89,
    height: 89,
    borderRadius: 89,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: hexAlpha(COLOR.Silver, 10),
  },

  // -------- Button ----------

  buttonContent: {
    //
    paddingHorizontal: 37,
    paddingVertical: 18,
  },
  buttonContent_fill: {
    backgroundColor: hexAlpha(COLOR.Silver, 10),
  },

  buttonText: {
    fontSize: 14,
    lineHeight: 18,
  },
});
