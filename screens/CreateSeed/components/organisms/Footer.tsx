import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Button, ButtonBack, Icon2 } from "components/atoms";
import { useTheme } from "hooks";

type Props = {
  onPressBack(): void;
  onPressNext(): void;
  nextButtonText: string;
  isHideNext?: boolean;
  isDisableNext?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default ({
  onPressBack,
  onPressNext,
  nextButtonText,
  style,
  isDisableNext,
  isHideNext,
}: Props) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>
        <ButtonBack onPress={onPressBack} />
      </View>

      <View style={styles.right}>
        {!isHideNext && (
          <Button
            text={nextButtonText}
            Right={<Icon2 name="chevron_right" size={18} />}
            onPress={onPressNext}
            textStyle={[styles.buttonText, theme.text.primary]}
            contentContainerStyle={styles.buttonContent}
            disable={isDisableNext}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
  },
  left: { flex: 1, marginRight: 16 },
  right: { flex: 1 },

  buttonContent: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  buttonText: {
    fontFamily: "CircularStd",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 20,
  },
});
