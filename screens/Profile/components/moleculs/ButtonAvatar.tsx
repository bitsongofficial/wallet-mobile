import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import React, { useCallback } from "react";
import { RectButton } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { COLOR, hexAlpha } from "utils";
import { Icon2 } from "components/atoms";

type Props = {
  source: ImageSourcePropType | undefined | null;
  onChange(uri: string): void;
};

export default ({ source, onChange }: Props) => {
  const pickImage = useCallback(async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      onChange(result.uri);
    }
  }, []);

  return (
    <RectButton onPress={pickImage} style={styles.button}>
      <View style={styles.avatar}>
        {source ? (
          <Image
            source={source}
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
  );
};

const styles = StyleSheet.create({
  button: {
    width: 129,
    height: 129,
    borderRadius: 129,
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
});
