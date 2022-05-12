import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Button, ButtonBack, Icon2 } from "components/atoms";
import { useTheme } from "hooks";

type Props = {
  onPressBack(): void;
  onPressNext(): void;
  nextButtonText: string;
  style?: StyleProp<ViewStyle>;
};

export default ({ onPressBack, onPressNext, nextButtonText, style }: Props) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>
        <ButtonBack onPress={onPressBack} />
      </View>

      <View style={styles.right}>
        <Button
          contentContainerStyle={styles.buttonContent}
          onPress={onPressNext}
          // onPress={open}
          // disable={!biometric.access}
          // IconRight={<Icon name="arrow_r" size={10} />}
        >
          <Text style={[styles.buttonText, theme.text.primary]}>
            {nextButtonText}
          </Text>
          <Icon2 name="chevron_right" size={18} />
        </Button>
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
  },
  left: { flex: 2, marginRight: 16 },
  right: { flex: 2 },

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
