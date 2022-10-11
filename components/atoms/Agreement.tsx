import { Trans, useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { COLOR } from "utils";

type Props = {
  style?: StyleProp<TextStyle>;
  onPressTerms?(): void;
  onPressPrivacy?(): void;
};

export default ({ style, onPressPrivacy, onPressTerms }: Props) => {
  const { t } = useTranslation()
  const TermsAndConditions = t("TermsAndConditions")
  const PrivacyPolicy = t("PrivacyPolicy")
  return (
    <Text style={[styles.text, style]}>
      <Trans i18nKey="ByUsingThisAppYouAgree">
        By creating an account, you’re agree to Cosmonautico
        <Text onPress={onPressTerms} style={styles.link}>
          {{TermsAndConditions}}
        </Text>
        &
        <Text onPress={onPressPrivacy} style={styles.link}>
          {{PrivacyPolicy}}
        </Text>
      </Trans>
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 18,
    color: COLOR.Purple,
  },
  link: { color: COLOR.White },
});
