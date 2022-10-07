import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Phrase } from "classes";
import { Button, GradientText } from "components/atoms";
import { StyleSheet, Text, View } from "react-native";
import { Title } from "../../atoms";
import { Phrase as PhraseView } from "components/moleculs";
import { COLOR } from "utils";
import { observer } from "mobx-react-lite";
import { useTheme } from "hooks";
import { useTranslation } from "react-i18next";

type CreateStepProps = {
  isHidden: boolean;
  onPressToggle(): void;
  phrase: Phrase;
};

export default observer(
  ({ isHidden, onPressToggle, phrase }: CreateStepProps) => {
    const { t } = useTranslation()
    const theme = useTheme();
    return (
      <>
        <Title style={styles.title}>{t("CreateNewMnemonic")}</Title>
        <Text style={styles.caption}>
          {t("OnlyWayToRecoverMnemonic")}
        </Text>
        <View style={{ alignItems: "center" }}>
          {isHidden ? (
            <Button
              style={styles.button}
              onPress={onPressToggle}
              text={t("Show")}
              contentContainerStyle={styles.buttonContainer}
            />
          ) : (
            <Button
              style={styles.button}
              onPress={onPressToggle}
              mode="gradient_border"
              contentContainerStyle={styles.buttonContainer_gradient}
            >
              <GradientText style={[styles.text, theme.text.primary]}>
                {t("Hide")}
              </GradientText>
            </Button>
          )}
        </View>
        <BottomSheetScrollView
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ paddingBottom: 116 }}
        >
          <PhraseView
            style={styles.phrase}
            hidden={isHidden}
            value={phrase.words}
          />
        </BottomSheetScrollView>
      </>
    );
  }
);

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: "center",

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
  phrase: {
    alignItems: "center",
  },

  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 15,
  },

  button: {
    marginBottom: 25,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonContainer_gradient: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 50,
    backgroundColor: COLOR.Dark3,
  },
});
