import {
  Image,
  ImageSourcePropType,
  ImageURISource,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useStore, useTheme } from "hooks";
import { COLOR, hexAlpha } from "utils";
import { Button, Icon2 } from "components/atoms";
import { observer } from "mobx-react-lite";
import { Title } from "../atoms";
import { useCallback, useMemo, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { RectButton } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

type Props = {
  close(): void;
  onClose?(): void;
};

export default observer<Props>(({ close }) => {
  const { t } = useTranslation()
  const theme = useTheme();
  const { wallet } = useStore()

  // -------- Image -----------
  const [image, setImage] = useState<string | null>(null);

  const photo = useMemo<ImageURISource | undefined | null>(
    () => ({ uri: image ??  wallet.activeProfile?.avatar}),
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

  // --------- Close -----------

  const save = useCallback(() => {
    if (photo && photo.uri) wallet.changeActiveProfileAvatar(photo.uri);
    close();
  }, [wallet, wallet.activeProfile, photo]);

  return (
    <View style={styles.container}>
      <Title style={styles.title}>
        {t("AddPhoto")}
      </Title>
      <Text style={[styles.subtitle, theme.text.primary]}>{t("Optional")}</Text>

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
          text={t("Proceed")}
          onPress={save}
          contentContainerStyle={styles.buttonContent}
          textStyle={styles.buttonText}
        />
      ) : (
        <Button
          mode="fill"
          text={t("Skip")}
          onPress={close}
          contentContainerStyle={[
            styles.buttonContent,
            styles.buttonContent_fill,
          ]}
          textStyle={styles.buttonText}
        />
      )}
    </View>
  );
});

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
