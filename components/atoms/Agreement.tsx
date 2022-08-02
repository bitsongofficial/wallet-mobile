import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { COLOR } from "utils";

type Props = {
  style?: StyleProp<TextStyle>;
  onPressTerms?(): void;
  onPressPrivacy?(): void;
};

export default ({ style, onPressPrivacy, onPressTerms }: Props) => {
  return (
    <Text style={[styles.text, style]}>
      By creating an account, you’re agree to Cosmonautico {"\n"}
      <Text onPress={onPressTerms} style={styles.link}>
        Terms and Conditions
      </Text>{" "}
      &{" "}
      <Text onPress={onPressPrivacy} style={styles.link}>
        Privacy Policy
      </Text>
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
