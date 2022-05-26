import { Image, StyleSheet, Text, View } from "react-native";
import { useTheme } from "hooks";
import { COLOR, hexAlpha } from "utils";
import { Button } from "components/atoms";
import { observer } from "mobx-react-lite";
import { Title } from "../atoms";

type Props = {
  close?(): void;
};

export default observer<Props>(({ close }) => {
  const theme = useTheme();

  const photo = require("assets/images/mock/avatar_2.png");
  return (
    <View style={styles.container}>
      <Title style={styles.title}>Add Photos</Title>
      <Text style={[styles.subtitle, theme.text.primary]}>optional</Text>

      <View style={styles.avatar}>
        <Image source={photo} />
      </View>

      {photo ? (
        <Button
          text="Proceed"
          onPress={close}
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
            photo && styles.buttonContent_fill,
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
