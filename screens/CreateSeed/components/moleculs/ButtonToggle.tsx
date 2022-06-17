import { StyleSheet } from "react-native";
import { Button, GradientText, Icon2 } from "components/atoms";
import { useTheme } from "hooks";
import { COLOR } from "utils";

type Props = {
  isHidden: boolean;
  onPress(): void;
};

export default ({ isHidden, onPress }: Props) => {
  const theme = useTheme();
  return isHidden ? (
    <Button
      mode="gradient"
      text="Show Phrase"
      contentContainerStyle={styles.content}
      textStyle={[styles.text, theme.text.primary]}
      Right={<Icon2 name="eye" size={18} stroke={theme.text.primary.color} />}
      onPress={onPress}
    />
  ) : (
    <Button
      mode="gradient_border"
      contentContainerStyle={styles.content_gradient}
      Right={<Icon2 name="eye_closed_gradient" size={18} />}
      onPress={onPress}
    >
      <GradientText style={[styles.text, theme.text.primary]}>
        Hide Phrase
      </GradientText>
    </Button>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: 13,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  content_gradient: {
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 50,
    justifyContent: "space-between",
    backgroundColor: COLOR.Dark3,
  },
  text: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
  },
});
